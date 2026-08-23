import AttachmentPopup, {
  type AttachmentType,
} from "./composerActions/AttachmentPopu";
import EmojiPopup from "./composerActions/EmojiPopup";
import TemplatePopup from "./composerActions/TemplatePopup";

interface ComposerActionsProps {
  showEmojiPicker: boolean;
  showAttachmentMenu: boolean;
  showTemplateMenu: boolean;
  isRecording: boolean;

  inputRef?: React.RefObject<HTMLInputElement>;

  onCloseEmoji: () => void;
  onCloseAttachment: () => void;
  onTemplateSelected: (template: any) => void;
  onCloseTemplate: () => void;

  onEmojiSelect: (emoji: string) => void;

  onAttachmentSelected: (file: File, type: AttachmentType) => void;

  onVoiceRecorded?: (blob: Blob) => void;
}

const ComposerActions = ({
  showEmojiPicker,
  showAttachmentMenu,
  showTemplateMenu,
  onCloseAttachment,
  onTemplateSelected,
  onCloseTemplate,
  onEmojiSelect,
  onAttachmentSelected,
  onCloseEmoji,
  // onVoiceRecorded,
}: ComposerActionsProps) => {
  return (
    <>
      {showEmojiPicker && (
        <EmojiPopup
          open={showEmojiPicker}
          onSelect={onEmojiSelect}
          onClose={onCloseEmoji}
        />
      )}

      <AttachmentPopup
        open={showAttachmentMenu}
        onFileSelected={onAttachmentSelected}
        onClose={onCloseAttachment}
      />

      <TemplatePopup
        open={showTemplateMenu}
        onClose={onCloseTemplate}
        onSelect={onTemplateSelected}
      />
    </>
  );
};

export default ComposerActions;
