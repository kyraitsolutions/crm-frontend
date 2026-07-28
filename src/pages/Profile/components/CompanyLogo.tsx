import { ToastMessageService } from "@/services";
import { mediaService } from "@/services/media.service";
import type { ApiError } from "@/types";
import { validateFile } from "@/utils/media.utils";
import { uploadFileToS3WithPresignedUrl } from "@/utils/s3-upload.utils";
import { Camera } from "lucide-react";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import ImageViewer from "../UserProfile/components/ImageViewer";

const CompanyLogo = ({
  name,
  logo,
  setFormData,
  isEdit,
}: {
  name: string;
  logo: string;
  isEdit: boolean;
  setFormData?: Dispatch<SetStateAction<any>>;
}) => {
  const toastService = new ToastMessageService();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const [open, setOpen] = useState<boolean>(false);

  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingProgress, setUploadProgress] = useState(0);
  console.log(isUploading, uploadingProgress)



  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) {
      toastService.error(`Maximum file size is 10mb.`);
      return
    };
    setPreviewUrl(URL.createObjectURL(file));

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPayload = {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        type: "template",
      };

      // 🔹 get signed url
      const response = await mediaService.getMediaUploadPresignedUrl(uploadPayload);

      const doc = response.data?.doc;
      console.log(doc)

      if (response.status === 200 || response.status === 201) {
        // 🔹 upload to s3
        await uploadFileToS3WithPresignedUrl(
          doc.uploadUrl,
          file,
          (progress) => {
            setUploadProgress(progress);
          },
        );
      }
      setFormData?.((prev: any) => ({
        ...prev,
        logoUrl: doc?.fileUrl,
      }));
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastService.apiError(err.message || "Failed to upload file");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Image */}
      <div className="relative">
        <div
          className={`w-20 h-20 rounded-full overflow-hidden border border-slate-200 ${isEdit && "cursor-pointer"}`}
          onClick={() => isEdit && handleImageClick()}
        >
          {logo ? (
            <img onClick={() => setOpen(true)} src={logo} alt="logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera size={20} className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Camera Icon */}

        {isEdit && (
          <div
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full cursor-pointer"
          >
            <Camera size={14} />
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <p className="text-lg font-semibold text-slate-800">
          {name || "Company"}
        </p>
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        // accept=".png,.jpg,.jpeg,.webp"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleSelectFile}
      />

      {open && <ImageViewer url={logo || ""} setOpen={setOpen} />}
    </div>
  );
};

export default CompanyLogo;
