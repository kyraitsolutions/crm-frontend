import { useMemo, useRef, useState } from "react";

import type { TemplateForm } from "@/pages/Channels/whatsapp/validations/template.schema";
import { useFormContext, useWatch } from "react-hook-form";
import { HeaderMediaPreview } from "./HeaderMediaPreview";
import { UploadDropzone } from "./UploadDropzone";
import { HEADER_MEDIA_CONFIG } from "./header-media.constants";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import { mediaService } from "@/services/media.service";
import { uploadFileToS3WithPresignedUrl } from "@/utils/s3-upload.utils";

export function HeaderMediaUploader() {
  // const { headerType, headerMedia, setHeaderMedia, clearHeaderMedia } =
  //   useTemplateStore((state) => state);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const toastService = new ToastMessageService();
  const { control, setValue } = useFormContext<TemplateForm>();

  const headerType = useWatch({
    control,
    name: "headerType",
  });

  const headerMedia = useWatch({
    control,
    name: "headerMedia",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const config = useMemo(
    () => HEADER_MEDIA_CONFIG[headerType as "Image" | "Video" | "Document"],
    [headerType],
  );

  const [previewUrl, setPreviewUrl] = useState<string>();

  const validateFile = (file: File) => {
    if (file.size > config.maxSize) {
      toastService.error(`Maximum file size is ${config.maxSizeLabel}.`);
      return false;
    }

    return true;
  };

  const handleSelectFile = async (file: File) => {
    if (!validateFile(file)) return;
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
      const response =
        await mediaService.getMediaUploadPresignedUrl(uploadPayload);

      const doc = response.data?.doc;

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

      setValue(
        "headerMedia",
        {
          file: file,
          previewUrl: doc?.fileUrl,
          name: file.name,
          size: file.size,
          mimeType: file.type,
        },
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );

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

  const handleReplace = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setValue("headerMedia", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(undefined);
  };

  // const handleRemove = () => {
  //   clearHeaderMedia();

  //   if (previewUrl) {
  //     URL.revokeObjectURL(previewUrl);
  //   }

  //   setPreviewUrl(undefined);
  // };

  return (
    <div className="space-y-3">
      {!headerMedia ? (
        <>
          <UploadDropzone
            accept={config.accept}
            onFileSelect={handleSelectFile}
            inputRef={inputRef as React.RefObject<HTMLInputElement>}
          />

          <p className="text-xs text-muted-foreground">
            Supported: {config.supportedFormats}
            <br />
            Maximum file size: {config.maxSizeLabel}
          </p>

          {isUploading && (
            <div className="rounded-lg border p-6">
              <p className="text-sm font-medium">Uploading...</p>

              <div className="mt-3 h-2 w-full rounded bg-gray-200">
                <div
                  className="h-full rounded bg-blue-600 transition-all"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {uploadProgress}%
              </p>
            </div>
          )}
        </>
      ) : (
        <HeaderMediaPreview
          type={headerType as "Image" | "Video" | "Document"}
          file={headerMedia as any}
          previewUrl={previewUrl}
          onReplace={handleReplace}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
