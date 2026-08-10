import AudioPreview from "./components/composerContent/AudioPreview";
import ComposerActions from "./components/ComposerActions";
import ComposerContent from "./components/ComposerContent";
import ComposerInput from "./components/composerContent/ComposerInput";
import ComposerPreview from "./components/ComposerPreview";
import ComposerToolbar from "./components/ComposerToolbar";
import VoiceRecorder from "./components/composerContent/VoiceRecorder";

import { useWhatsappComposer } from "./hooks/useWhatsappComposer";
import { useChatSender } from "./hooks/useChatSender";
import { useAuthStore } from "@/stores";
import { buildOutgoingMessage } from "./utils/buildOutgoingMessage";
import { useConversationStore } from "../../store/conversation.store";
import { buildWhatsappPayload } from "./utils/buildWhatsappPayload";
import { buildFormData } from "./utils/buildFormData";

const WhatsAppComposer = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const selectedConversationId = useConversationStore(
    (state) => state.selectedConversationId,
  );
  const conversation = useConversationStore((state) =>
    state.conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ),
  );

  const composer = useWhatsappComposer();
  const { sendMessage } = useChatSender();

  const handleSend = async () => {
    const outgoing = buildOutgoingMessage(composer as any);

    console.log(outgoing);

    if (!outgoing) return;

    const payload = buildWhatsappPayload(
      String(conversation?.contact?.phoneNumber),
      outgoing,
    );

    console.log("payload", payload);

    const formData = buildFormData(payload);

    await sendMessage(String(accountId), formData);
  };

  return (
    <div className="relative space-y-2 border-t p-4 ">
      <ComposerPreview
        file={composer.selectedFile}
        previewUrl={composer.previewUrl}
        caption={composer.caption}
        onCaptionChange={composer.setCaption}
        onRemove={composer.removeAttachment}
      />

      <ComposerActions
        showEmojiPicker={composer.showEmojiPicker}
        showAttachmentMenu={composer.showAttachmentMenu}
        showTemplateMenu={composer.showTemplateMenu}
        isRecording={composer.isRecording}
        // inputRef={composer.inputRef}
        onTemplateSelected={composer.handleTemplate}
        onCloseEmoji={() => composer.setShowEmojiPicker(false)}
        onCloseAttachment={() => composer.setShowAttachmentMenu(false)}
        onCloseTemplate={() => composer.setShowTemplateMenu(false)}
        onEmojiSelect={(emoji) => composer.setMessage((prev) => prev + emoji)}
        onAttachmentSelected={composer.handleAttachment}
      />

      <div className="flex lg:flex-row flex-col lg:items-center gap-2">
        <ComposerToolbar
          onEmojiClick={() => composer.setShowEmojiPicker((prev) => !prev)}
          onAttachmentClick={() =>
            composer.setShowAttachmentMenu((prev) => !prev)
          }
          onTemplateClick={() => composer.setShowTemplateMenu((prev) => !prev)}
          onRecordClick={() => composer.setIsRecording((prev) => !prev)}
        />

        <ComposerContent composer={composer} onSend={handleSend} />

        {/* <ComposerInput
          value={composer.message}
          onChange={composer.setMessage}
          inputRef={composer.inputRef}
          disabled={composer.sending}
          onSend={() => {
            console.log(composer.message);
            composer.setMessage("");
          }}
        /> */}
      </div>
    </div>
  );
};

export default WhatsAppComposer;
