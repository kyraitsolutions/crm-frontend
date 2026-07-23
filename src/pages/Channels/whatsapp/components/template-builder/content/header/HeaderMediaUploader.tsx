import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { UploadDropzone } from "./UploadDropzone";
import { HeaderMediaPreview } from "./HeaderMediaPreview";
import { HEADER_MEDIA_CONFIG } from "./header-media.constants";
import { useTemplateStore } from "@/pages/Channels/whatsapp/store/template-builder.store";

export function HeaderMediaUploader() {
  const { headerType, headerMedia, setHeaderMedia, clearHeaderMedia } =
    useTemplateStore((state) => state);

  const inputRef = useRef<HTMLInputElement>(null);

  const config = useMemo(
    () => HEADER_MEDIA_CONFIG[headerType as "Image" | "Video" | "Document"],
    [headerType],
  );

  const [previewUrl, setPreviewUrl] = useState<string>();

  const validateFile = (file: File) => {
    if (file.size > config.maxSize) {
      toast.error(`Maximum file size is ${config.maxSizeLabel}.`);
      return false;
    }

    return true;
  };

  const handleSelectFile = (file: File) => {
    if (!validateFile(file)) return;

    setHeaderMedia(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleReplace = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    clearHeaderMedia();

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(undefined);
  };

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
