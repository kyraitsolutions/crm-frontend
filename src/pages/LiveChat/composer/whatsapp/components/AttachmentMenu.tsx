import { MdImage, MdInsertDriveFile } from "react-icons/md";

interface IAttachmentMenuProps {
  open: boolean;
  onImageClick: () => void;
  onDocumentClick: () => void;
}

const AttachmentMenu = ({
  open,
  onImageClick,
  onDocumentClick,
}: IAttachmentMenuProps) => {
  if (!open) return null;

  return (
    <div className="absolute bottom-18 left-16 w-52 rounded-xl border bg-white shadow-lg overflow-hidden z-50">
      <button
        type="button"
        onClick={onImageClick}
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100"
      >
        <MdImage size={22} className="text-green-500" />

        <span>Photo / Video</span>
      </button>

      <button
        type="button"
        onClick={onDocumentClick}
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100"
      >
        <MdInsertDriveFile size={22} className="text-blue-500" />

        <span>Document</span>
      </button>
    </div>
  );
};

export default AttachmentMenu;
