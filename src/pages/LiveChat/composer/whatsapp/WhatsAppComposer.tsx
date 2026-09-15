import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import ComposerActions from "./components/ComposerActions";
import ComposerContent from "./components/ComposerContent";
import ComposerPreview from "./components/ComposerPreview";
import ComposerToolbar from "./components/ComposerToolbar";
import CannedMessagePopup from "./components/composerActions/CannedMessagePopup";

import { useAuthStore } from "@/stores";
import { useConversationStore } from "../../store/conversation.store";
import { useChatSender } from "./hooks/useChatSender";
import { useWhatsappComposer } from "./hooks/useWhatsappComposer";
import { buildFormData } from "./utils/buildFormData";
import { buildOutgoingMessage } from "./utils/buildOutgoingMessage";
import { buildWhatsappPayload } from "./utils/buildWhatsappPayload";
import { buildTemplatePayload } from "./utils/buildTemplatePayload";
import { buildTemplateOutgoingMessage } from "./utils/buildTemplateOutgoingMessage";
import { useCannedMessageStore } from "@/pages/Channels/whatsapp/store/canned-message.store";
import type { TCannedMessage } from "@/pages/Channels/whatsapp/types/canned-message.type";
import {
  filterCannedMessages,
  getActiveSlashToken,
  replaceSlashToken,
  resolveCannedVariables,
} from "@/pages/Channels/whatsapp/utils/canned-message.utils";
import { ToastMessageService } from "@/services";
import type { AttachmentType } from "./hooks/useWhatsappComposer";

const WhatsAppComposer = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const accountName = useAuthStore((state) => state.accountName);
  const user = useAuthStore((state) => state.user);
  const selectedConversationId = useConversationStore(
    (state) => state.selectedConversationId,
  );

  const conversation = useConversationStore((state) =>
    state.conversations.find(
      (item) => item.id === selectedConversationId,
    ),
  );

  const composer = useWhatsappComposer();
  const { sendMessage } = useChatSender();
  const toastService = useMemo(() => new ToastMessageService(), []);

  const { messages, loading, error, fetchMessages, markUsed } =
    useCannedMessageStore((state) => state);

  const [cursor, setCursor] = useState(0);
  const [slashOpen, setSlashOpen] = useState(false);
  const [popupSearch, setPopupSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef(false);
  const lastQueryRef = useRef("");

  const is24HourWindowOpen =
    !!conversation?.customerWindowExpiresAt &&
    new Date(conversation.customerWindowExpiresAt) > new Date();

  const slashToken = useMemo(
    () => getActiveSlashToken(composer.message, cursor),
    [composer.message, cursor],
  );

  const publishedMessages = useMemo(
    () => messages.filter((item) => item.status === "PUBLISHED"),
    [messages],
  );

  const filteredCanned = useMemo(
    () =>
      filterCannedMessages(
        publishedMessages,
        popupSearch || slashToken?.query || "",
      ),
    [publishedMessages, popupSearch, slashToken?.query],
  );

  useEffect(() => {
    if (!slashToken) {
      dismissedRef.current = false;
      lastQueryRef.current = "";
      setSlashOpen(false);
      setPopupSearch("");
      setHighlightedIndex(0);
      return;
    }

    if (
      dismissedRef.current &&
      slashToken.query === lastQueryRef.current
    ) {
      return;
    }

    dismissedRef.current = false;
    lastQueryRef.current = slashToken.query;
    setSlashOpen((open) => {
      if (!open) {
        composer.setShowEmojiPicker(false);
        composer.setShowAttachmentMenu(false);
        composer.setShowTemplateMenu(false);
      }
      return true;
    });
    setPopupSearch(slashToken.query);
    setHighlightedIndex(0);
  }, [slashToken?.query, slashToken?.start]);

  useEffect(() => {
    if (!slashOpen || !accountId) return;
    void fetchMessages(String(accountId));
  }, [slashOpen, accountId, fetchMessages]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [popupSearch, filteredCanned.length]);

  useEffect(() => {
    if (!slashOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current?.contains(event.target as Node)) return;
      dismissedRef.current = true;
      lastQueryRef.current = slashToken?.query || "";
      setSlashOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [slashOpen, slashToken?.query]);

  const closeSlashPopup = () => {
    dismissedRef.current = true;
    lastQueryRef.current = slashToken?.query || "";
    setSlashOpen(false);
  };

  const variableContext = {
    customerName: conversation?.contact?.name,
    customerPhone: conversation?.contact?.phoneNumber,
    customerEmail: conversation?.contact?.email,
    agentName: `${user?.userProfile?.firstName || user?.firstName || ""} ${
      user?.userProfile?.lastName || user?.lastName || ""
    }`.trim(),
    propertyName: accountName,
  };

  const applyCannedMessage = (canned: TCannedMessage) => {
    const resolved = resolveCannedVariables(canned.text || "", variableContext);
    const token = slashToken;
    const sourceText = composer.message;

    if (canned.type !== "text") {
      if (!canned.media?.url) {
        toastService.error("This canned message media is no longer available");
        if (token) {
          composer.setMessage(
            replaceSlashToken(sourceText, token.start, token.end, resolved),
          );
        }
        closeSlashPopup();
        return;
      }

      const leftover = (
        token
          ? replaceSlashToken(sourceText, token.start, token.end, "")
          : sourceText
      ).trim();
      const caption = [leftover, resolved].filter(Boolean).join("\n\n");

      composer.setMessage("");
      composer.handleCannedMedia(
        {
          url: canned.media.url,
          fileName: canned.media.fileName,
          mimeType: canned.media.mimeType,
          size: canned.media.size,
          type: canned.type as AttachmentType,
        },
        caption,
      );
    } else {
      const next = token
        ? replaceSlashToken(sourceText, token.start, token.end, resolved)
        : `${sourceText}${resolved}`;
      composer.setMessage(next);
      requestAnimationFrame(() => {
        const el = composer.inputRef.current;
        if (!el) return;
        const pos = (token?.start || 0) + resolved.length;
        el.focus();
        el.setSelectionRange(pos, pos);
        setCursor(pos);
      });
    }

    if (accountId) markUsed(String(accountId), canned.id);
    closeSlashPopup();
  };

  const handleComposerKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (!slashOpen) return false;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) =>
        Math.min(index + 1, Math.max(filteredCanned.length - 1, 0)),
      );
      return true;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
      return true;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const selected = filteredCanned[highlightedIndex];
      if (selected) applyCannedMessage(selected);
      return true;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSlashPopup();
      return true;
    }

    return false;
  };

  const handleSend = async () => {
    const outgoing = buildOutgoingMessage(composer as any);

    if (!outgoing) return;

    const payload = buildWhatsappPayload(
      String(conversation?.contact?.phoneNumber),
      outgoing,
    );

    if (!payload) return;

    const formData = buildFormData(payload);
    await sendMessage({
      accountId: accountId as string,
      formData,
      outgoing,
      conversationId: String(selectedConversationId),
    });
  };

  const handleSendTemplate = async () => {
    if (!composer.selectedTemplate) return;

    const payload = buildTemplatePayload({
      phoneNumber: String(conversation?.contact?.phoneNumber),
      template: composer.selectedTemplate,
      variables: composer.templateVariableValues,
    });

    const formData = buildFormData(payload);

    const outgoing = buildTemplateOutgoingMessage(
      composer.selectedTemplate,
      composer.templateVariableValues,
    );

    await sendMessage({
      accountId: accountId as string,
      formData,
      outgoing,
      conversationId: String(selectedConversationId),
    });
  };

  return (
    <div className="relative space-y-2 overflow-visible border-t p-4 ">
      <ComposerPreview
        file={composer.selectedFile}
        previewUrl={composer.previewUrl}
        caption={composer.caption}
        attachmentType={composer.selectedAttachmentType}
        fileName={composer.cannedMedia?.fileName}
        mimeType={composer.cannedMedia?.mimeType}
        onCaptionChange={composer.setCaption}
        onRemove={composer.removeAttachment}
      />

      <ComposerActions
        showEmojiPicker={composer.showEmojiPicker}
        showAttachmentMenu={composer.showAttachmentMenu}
        showTemplateMenu={composer.showTemplateMenu}
        isRecording={composer.isRecording}
        onTemplateSelected={composer.handleTemplate}
        onCloseEmoji={() => composer.setShowEmojiPicker(false)}
        onCloseAttachment={() => composer.setShowAttachmentMenu(false)}
        onCloseTemplate={() => composer.setShowTemplateMenu(false)}
        onEmojiSelect={(emoji) => composer.setMessage((prev) => prev + emoji)}
        onAttachmentSelected={composer.handleAttachment}
        showVariableMapping={composer.showVariableMapping}
        selectedTemplate={composer.selectedTemplate}
        templateVariables={composer.templateVariables}
        templateVariableValues={composer.templateVariableValues}
        onVariableChange={composer.handleVariableChange}
        onCloseVariableMapping={() => composer.setShowVariableMapping(false)}
        onSendTemplate={handleSendTemplate}
      />

      <div className="flex lg:flex-row flex-col lg:items-center gap-2">
        {!composer?.selectedAttachmentType && (
          <ComposerToolbar
            isCustomerWindowOpen={is24HourWindowOpen}
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

        <div ref={wrapRef} className="relative flex-1 min-w-0">
          <CannedMessagePopup
            open={slashOpen && is24HourWindowOpen}
            search={popupSearch}
            items={filteredCanned}
            totalCount={publishedMessages.length}
            loading={loading}
            error={error}
            highlightedIndex={highlightedIndex}
            onSearchChange={(value) => {
              setPopupSearch(value);
              setHighlightedIndex(0);
            }}
            onHighlight={setHighlightedIndex}
            onSelect={applyCannedMessage}
          />
          <ComposerContent
            composer={composer}
            onSend={handleSend}
            disabled={!is24HourWindowOpen}
            onComposerKeyDown={handleComposerKeyDown}
            onCursorChange={setCursor}
          />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppComposer;
