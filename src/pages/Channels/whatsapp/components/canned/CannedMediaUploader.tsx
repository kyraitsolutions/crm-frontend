import { useState } from "react";
import { UploadDropzone } from "@/pages/Channels/whatsapp/components/template-builder/content/header/UploadDropzone";
import { mediaService } from "@/services/media.service";
import { ToastMessageService } from "@/services";
import { uploadFileToS3WithPresignedUrl } from "@/utils/s3-upload.utils";
import type { ApiError } from "@/types";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { CANNED_MEDIA_ACCEPT } from "../../constants/canned.constants";
import type { CannedMessageMedia, CannedMessageType } from "../../types/canned-message.type";

type MediaType = Exclude<CannedMessageType, "text">;

interface CannedMediaUploaderProps {
  type: MediaType;
  media: CannedMessageMedia;
  onChange: (media: CannedMessageMedia) => void;
}

const CannedMediaUploader = ({
  type,
  media,
  onChange,
}: CannedMediaUploaderProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const toastService = new ToastMessageService();
  const config = CANNED_MEDIA_ACCEPT[type];

  const handleSelectFile = async (file: File) => {
    if (file.size > config.maxSize) {
      toastService.error(
        `Maximum file size is ${Math.round(config.maxSize / (1024 * 1024))} MB.`,
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await mediaService.getMediaUploadPresignedUrl({
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        type: "template",
      });

      const doc = response.data?.doc;
      if (!doc?.uploadUrl || !doc?.fileUrl) {
        throw new Error("Failed to upload file");
      }

      await uploadFileToS3WithPresignedUrl(doc.uploadUrl, file, (progress) => {
        setUploadProgress(progress);
      });

      onChange({
        url: doc.fileUrl,
        key: doc.key,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      });
    } catch (error) {
      const err = error as ApiError;
      toastService.apiError(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  if (media?.url) {
    return (
      <div className="space-y-3 rounded-2xl border p-4">
        {type === "image" && (
          <img
            src={media.url}
            alt={media.fileName || "image"}
            className="h-50 w-full rounded-lg object-cover"
          />
        )}
        {type === "video" && (
          <video controls src={media.url} className="h-50 w-full rounded-lg" />
        )}
        {type === "audio" && (
          <audio controls src={media.url} className="w-full" />
        )}
        {type === "document" && (
          <div className="flex h-36 flex-col items-center justify-center rounded-lg border bg-muted/30">
            <FileText className="mb-3 h-14 w-14 text-primary" />
            <p className="font-medium">{media.fileName || "Document"}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-medium">
            {media.fileName || "Uploaded file"}
          </p>
          <Button
            type="button"
            className="actions-btn px-2! hover:bg-destructive! hover:text-white!"
            onClick={() => onChange(null)}
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <UploadDropzone accept={config.accept} onFileSelect={handleSelectFile} />
      <p className="text-xs text-muted-foreground">
        Supported: {config.acceptLabels}
      </p>
      {isUploading && (
        <div className="rounded-lg border p-6">
          <p className="text-sm font-medium">Uploading...</p>
          <div className="mt-3 h-2 w-full rounded bg-gray-200">
            <div
              className="h-full rounded bg-blue-600 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};

export default CannedMediaUploader;
