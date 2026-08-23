import ComposerActions from "./components/ComposerActions";
import ComposerContent from "./components/ComposerContent";
import ComposerPreview from "./components/ComposerPreview";
import ComposerToolbar from "./components/ComposerToolbar";

import { useAuthStore } from "@/stores";
import { useConversationStore } from "../../store/conversation.store";
import { useChatSender } from "./hooks/useChatSender";
import { useWhatsappComposer } from "./hooks/useWhatsappComposer";
import { buildFormData } from "./utils/buildFormData";
import { buildOutgoingMessage } from "./utils/buildOutgoingMessage";
import { buildWhatsappPayload } from "./utils/buildWhatsappPayload";

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

    if (!outgoing) return;

    const payload = buildWhatsappPayload(
      String(conversation?.contact?.phoneNumber),
      outgoing,
    );

    const formData = buildFormData(payload);
    await sendMessage({
      accountId: accountId as string,
      formData,
      outgoing,
      conversationId: String(selectedConversationId),
    });
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
        onCloseAttachment={() => {
          composer.setShowAttachmentMenu(false);
        }}
        onCloseTemplate={() => composer.setShowTemplateMenu(false)}
        onEmojiSelect={(emoji) => composer.setMessage((prev) => prev + emoji)}
        onAttachmentSelected={composer.handleAttachment}
      />

      <div className="flex lg:flex-row flex-col lg:items-center gap-2">
        {!composer?.selectedAttachmentType && (
          <ComposerToolbar
            onEmojiClick={() => composer.setShowEmojiPicker((prev) => !prev)}
            onAttachmentClick={() =>
              composer.setShowAttachmentMenu((prev) => !prev)
            }
            onTemplateClick={() =>
              composer.setShowTemplateMenu((prev) => !prev)
            }
            onRecordClick={() => composer.setIsRecording((prev) => !prev)}
          />
        )}

        <ComposerContent composer={composer} onSend={handleSend} />
      </div>
    </div>
  );
};

export default WhatsAppComposer;
