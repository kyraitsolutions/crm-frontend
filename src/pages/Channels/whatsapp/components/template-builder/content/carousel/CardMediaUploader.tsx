import { useMemo, useRef, useState } from "react";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import { mediaService } from "@/services/media.service";
import { uploadFileToS3WithPresignedUrl } from "@/utils/s3-upload.utils";
import { HEADER_MEDIA_CONFIG } from "../header/header-media.constants";
import { HeaderMediaPreview } from "../header/HeaderMediaPreview";
import { UploadDropzone } from "../header/UploadDropzone";

export type CardMediaValue = {
  previewUrl: string;
  name: string;
  size: number;
  mimeType: string;
  file?: File;
};

interface CardMediaUploaderProps {
  mediaFormat: "IMAGE" | "VIDEO";
  value?: CardMediaValue;
  onChange: (value: CardMediaValue | undefined) => void;
}

export function CardMediaUploader({
  mediaFormat,
  value,
  onChange,
}: CardMediaUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const toastService = new ToastMessageService();

  const headerType = mediaFormat === "IMAGE" ? "Image" : "Video";
  const config = useMemo(
    () => HEADER_MEDIA_CONFIG[headerType],
    [headerType],
  );

  const validateFile = (file: File) => {
    if (file.size > config.maxSize) {
      toastService.error(`Maximum file size is ${config.maxSizeLabel}.`);
      return false;
    }
    return true;
  };

  const handleSelectFile = async (file: File) => {
    if (!validateFile(file)) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
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

      if (response.status === 200 || response.status === 201) {
        await uploadFileToS3WithPresignedUrl(
          doc.uploadUrl,
          file,
          (progress) => setUploadProgress(progress),
        );
      }

      onChange({
        file,
        previewUrl: doc?.fileUrl,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      });

      URL.revokeObjectURL(objectUrl);
      setLocalPreviewUrl(undefined);
    } catch (error) {
      const err = error as ApiError;
      toastService.apiError(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = localPreviewUrl || value?.previewUrl;

  return (
    <div className="space-y-3">
      {!value ? (
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
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium">Uploading...</p>
              <div className="mt-3 h-2 w-full rounded bg-gray-200">
                <div
                  className="h-full rounded bg-blue-600 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <HeaderMediaPreview
          type={headerType}
          file={
            (value.file ||
              ({
                name: value.name,
                size: value.size,
              } as File)) as File
          }
          previewUrl={displayUrl}
          onReplace={() => inputRef.current?.click()}
          onRemove={() => onChange(undefined)}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleSelectFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
