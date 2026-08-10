import { MdAttachFile, MdMic, MdOutlineEmojiEmotions } from "react-icons/md";
import { RiFileList2Line } from "react-icons/ri";

interface IComposerToolbarProps {
  onEmojiClick: () => void;
  onAttachmentClick: () => void;
  onTemplateClick: () => void;
  onRecordClick: () => void;
}

const ComposerToolbar = ({
  onEmojiClick,
  onAttachmentClick,
  onTemplateClick,
  onRecordClick,
}: IComposerToolbarProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Emoji */}

      <button
        type="button"
        onClick={onEmojiClick}
        className="text-gray-500 hover:text-primary transition-colors"
      >
        <MdOutlineEmojiEmotions size={24} />
      </button>

      {/* Attachment */}

      <button
        type="button"
        onClick={onAttachmentClick}
        className="text-gray-500 hover:text-primary transition-colors"
      >
        <MdAttachFile size={24} />
      </button>

      {/* Template */}

      <button
        type="button"
        onClick={onTemplateClick}
        className="text-gray-500 hover:text-primary transition-colors"
      >
        <RiFileList2Line size={22} />
      </button>

      {/* Voice */}

      <button
        type="button"
        onClick={onRecordClick}
        className="text-gray-500 hover:text-primary transition-colors"
      >
        <MdMic size={23} />
      </button>
    </div>
  );
};

export default ComposerToolbar;
