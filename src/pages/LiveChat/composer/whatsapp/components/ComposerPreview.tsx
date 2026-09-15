import { MdClose, MdInsertDriveFile } from "react-icons/md";
import type { AttachmentType } from "../hooks/useWhatsappComposer";

interface IComposerPreviewProps {
  file: File | null;
  previewUrl?: string;
  caption: string;
  attachmentType?: AttachmentType | null;
  fileName?: string;
  mimeType?: string;
  onCaptionChange: (value: string) => void;
  onRemove: () => void;
}

const ComposerPreview = ({
  file,
  previewUrl,
  caption,
  attachmentType,
  fileName,
  mimeType,
  onCaptionChange,
  onRemove,
}: IComposerPreviewProps) => {
  if (!file && !previewUrl) return null;

  const type = mimeType || file?.type || "";
  const isImage = attachmentType === "image" || type.startsWith("image/");
  const isVideo = attachmentType === "video" || type.startsWith("video/");
  const isAudio = attachmentType === "audio" || type.startsWith("audio/");
  const displayName = file?.name || fileName || "Attachment";
  const displaySize = file?.size;
  const allowCaption = isImage || isVideo || attachmentType === "document";

  return (
    <div className="rounded-xl border bg-gray-50 p-2">
      <div className="flex justify-end">
        <button
          onClick={onRemove}
          className="rounded-full p-1 hover:bg-gray-200"
        >
          <MdClose size={18} />
        </button>
      </div>

      {isImage && previewUrl && (
        <img
          src={previewUrl}
          className="max-h-20 rounded-lg mx-auto object-contain"
        />
      )}

      {isVideo && previewUrl && (
        <video
          src={previewUrl}
          controls
          className="max-h-20 rounded-lg mx-auto"
        />
      )}

      {isAudio && previewUrl && (
        <audio src={previewUrl} controls className="w-full" />
      )}

      {!isImage && !isVideo && !isAudio && (
        <div className="flex items-center gap-3 py-6">
          <MdInsertDriveFile size={42} className="text-primary" />

          <div>
            <p className="font-medium">{displayName}</p>
            {displaySize ? (
              <p className="text-xs text-gray-500">
                {(displaySize / 1024 / 1024).toFixed(2)} MB
              </p>
            ) : null}
          </div>
        </div>
      )}

      {allowCaption && (
        <input
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Add a caption..."
          className="mt-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      )}
    </div>
  );
};

export default ComposerPreview;
