import type { TTemplate } from "@/pages/Channels/whatsapp/types/templates";
import AttachmentPopup, {
  type AttachmentType,
} from "./composerActions/AttachmentPopu";
import EmojiPopup from "./composerActions/EmojiPopup";
import TemplatePopup from "./composerActions/TemplatePopup";
import { TemplateVariablePopup } from "./composerActions/TemplateVariablePopup";
import type { TemplateVariable } from "@/pages/Channels/whatsapp/types/templates/template.type";

interface ComposerActionsProps {
  showEmojiPicker: boolean;
  showAttachmentMenu: boolean;
  showTemplateMenu: boolean;
  isRecording: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;

  showVariableMapping: boolean;
  selectedTemplate: TTemplate | null;
  templateVariables: TemplateVariable[];
  templateVariableValues: Record<string, string>;

  onCloseEmoji: () => void;
  onCloseAttachment: () => void;
  onTemplateSelected: (template: any) => void;
  onCloseTemplate: () => void;

  onVariableChange: (variable: string, value: string) => void;
  onCloseVariableMapping: () => void;
  onSendTemplate: () => void;

  onEmojiSelect: (emoji: string) => void;

  onAttachmentSelected: (file: File, type: AttachmentType) => void;
  onVoiceRecorded?: (blob: Blob) => void;
}

const ComposerActions = ({
  showEmojiPicker,
  showAttachmentMenu,
  showTemplateMenu,

  showVariableMapping,
  selectedTemplate,
  templateVariables,
  templateVariableValues,

  onCloseAttachment,
  onTemplateSelected,
  onCloseTemplate,

  onEmojiSelect,
  onAttachmentSelected,
  onCloseEmoji,

  onVariableChange,
  onCloseVariableMapping,
  onSendTemplate,

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

      <TemplateVariablePopup
        values={templateVariableValues}
        open={showVariableMapping}
        template={selectedTemplate}
        variables={templateVariables}
        onChange={onVariableChange}
        onClose={onCloseVariableMapping}
        onSend={onSendTemplate}
      />
    </>
  );
};

export default ComposerActions;
