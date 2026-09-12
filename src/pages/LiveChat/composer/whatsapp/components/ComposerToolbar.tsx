import { MdAttachFile, MdMic, MdOutlineEmojiEmotions } from "react-icons/md";
import { RiFileList2Line } from "react-icons/ri";

interface IComposerToolbarProps {
  onEmojiClick: () => void;
  onAttachmentClick: () => void;
  onTemplateClick: () => void;
  onRecordClick: () => void;
  isCustomerWindowOpen: boolean;
}

const ComposerToolbar = ({
  onEmojiClick,
  onAttachmentClick,
  onTemplateClick,
  onRecordClick,
  isCustomerWindowOpen,
}: IComposerToolbarProps) => {
  return (
    <div className="flex items-center gap-3">
      {isCustomerWindowOpen && (
        <>
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

          {/* Voice  */}
          <button
            type="button"
            onClick={onRecordClick}
            className="text-gray-500 hover:text-primary transition-colors"
            title="Record voice message"
          >
            <MdMic size={23} />
          </button>
        </>
      )}

      {/* Template - ALWAYS available */}
      <button
        type="button"
        onClick={onTemplateClick}
        className="text-gray-500 hover:text-primary transition-colors"
        title="Send template"
      >
        <RiFileList2Line size={22} />
      </button>
    </div>
  );
};

export default ComposerToolbar;
