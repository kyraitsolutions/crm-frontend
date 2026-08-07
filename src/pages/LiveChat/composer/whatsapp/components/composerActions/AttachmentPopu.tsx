import { Mic } from "lucide-react";
import { useRef } from "react";
import { MdImage, MdInsertDriveFile, MdClose } from "react-icons/md";

export type AttachmentType = "image" | "document" | "audio" | "video";

interface AttachmentPopupProps {
  open: boolean;
  onFileSelected: (file: File, type: AttachmentType) => void;
  onClose: () => void;
}

const AttachmentPopup = ({
  open,
  onFileSelected,
  onClose,
}: AttachmentPopupProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  return (
    <div>
      {/* Hidden Image / Video Picker */}
      <input
        ref={imageInputRef}
        hidden
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;
          onFileSelected(file, "image");

          e.target.value = "";
          onClose();
        }}
      />

      {/* Hidden Document Picker */}
      <input
        ref={documentInputRef}
        hidden
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          onFileSelected(file, "document");

          e.target.value = "";
          onClose();
        }}
      />

      {/* Audio */}
      <input
        ref={audioInputRef}
        hidden
        type="file"
        accept="audio/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onFileSelected(file, "audio");
          e.target.value = "";
          onClose();
        }}
      />

      <div className="absolute bottom-28 left-14 z-50 w-60 overflow-hidden rounded-xl border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-medium text-sm">Attach File</span>

          <button onClick={onClose}>
            <MdClose size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
        >
          <MdImage size={22} className="text-green-500" />

          <div className="text-left">
            <p className="text-sm font-medium">Photo / Video</p>
            <p className="text-xs text-gray-500">JPG, PNG, MP4...</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => documentInputRef.current?.click()}
          className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
        >
          <MdInsertDriveFile size={22} className="text-blue-500" />

          <div className="text-left">
            <p className="text-sm font-medium">Document</p>
            <p className="text-xs text-gray-500">PDF, DOCX, XLSX...</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => audioInputRef.current?.click()}
          className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-100"
        >
          <Mic size={22} className="text-amber-500" />

          <div className="text-left">
            <p className="text-sm font-medium">Audio</p>
            {/* <p className="text-xs text-gray-500">PDF, DOCX, XLSX...</p> */}
          </div>
        </button>
      </div>
    </div>
  );
};

export default AttachmentPopup;
