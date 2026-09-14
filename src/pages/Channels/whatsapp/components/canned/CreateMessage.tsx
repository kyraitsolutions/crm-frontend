import { HEADER_MEDIA_TYPES } from "@/components/chatFlowEditior/config"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { formatWhatsappMessage } from "@/utils/textFormat"
import { Button } from "@/components/ui/button"
import { handleHistoryBack } from "@/utils/back.utils"
import { ArrowLeft } from "lucide-react"
import CannedMediaUploader from "./CannedMediaUploader"
import { useAuthStore } from "@/stores"
import { ToastMessageService } from "@/services"
import type { ApiError } from "@/types"
import { whatsappCannedMessageService } from "../../services/whatsapp-canned.service"
import { useCannedMessageStore } from "../../store/canned-message.store"
import type { CannedMessageMedia, CannedMessageType } from "../../types/canned-message.type"

const CreateMessage = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const accountId = useAuthStore((state) => state.accountId);
  const upsertMessage = useCannedMessageStore((state) => state.upsertMessage);
  const toastService = new ToastMessageService();
  const [templateName, setTemplateName] = useState<string>("");
  const [messageType, setMessageType] = useState<"text" | "image" | "video" | "document">("text")
  const [messageText, setMessageText] = useState<string>("")
  const [media, setMedia] = useState<CannedMessageMedia>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!accountId) return;
    if (!templateName.trim()) {
      toastService.error("Enter a canned message name");
      return;
    }
    if (messageType === "text" && !messageText.trim()) {
      toastService.error("Enter a message");
      return;
    }
    if (messageType !== "text" && !media?.url) {
      toastService.error("Upload media for this canned message");
      return;
    }

    setSubmitting(true);
    try {
      const response = await whatsappCannedMessageService.create(String(accountId), {
        name: templateName.trim(),
        type: messageType as CannedMessageType,
        text: messageText,
        media: messageType === "text" ? null : media,
      });
      if (response.data?.doc) {
        upsertMessage(response.data.doc);
      }
      toastService.success("Canned message created");
      handleHistoryBack();
    } catch (error) {
      const err = error as ApiError;
      toastService.apiError(err.message || "Failed to create canned message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar">
      <div className="flex items-center gap-4 mb-5">
        <Button
          onClick={handleHistoryBack}
          className="actions-btn rounded-full!"
        >
          <ArrowLeft />
        </Button>
        <p>New Canned Message</p>
      </div>

      <div className="flex-1 p-10 bg-white rounded-2xl">
        <div className="max-w-3xl flex flex-col gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Pick a name which describes your message.
            </p>
            <div className="relative">
              <Input
                className="input-field pr-14 rounded-xl! bg-gray-200/30 border-none"
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                maxLength={60}
                placeholder="e.g. order_confirmation"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                {templateName.length}/64
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Use lowercase letters and underscores only.
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Type
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Select one of the message types to proceed
            </p>
            <Select
              value={messageType}
              onValueChange={(value) => {
                setMessageType(value as "text" | "image" | "video" | "document");
                setMedia(null);
              }}
            >
              <SelectTrigger className="input-field rounded-xl! w-full capitalize  bg-gray-200/30 border-none">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-xl!">
                {HEADER_MEDIA_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 ">
            {messageType === "text" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {messageType}
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Use text formatting -*bold* & _italic_ <br />
                  Text can be upto 4096 characters long
                  <br />
                  Personalize messages with
                  $FirstName,$Name,$MobileNumber,$LastName$ custom attributes.
                  <br />
                  {
                    "Customize messages with dynamic parameters e.g - Your Verification code is {{1}}"
                  }
                </p>

                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                    }}
                    maxLength={1024}
                    rows={5}
                    placeholder="Enter your message body"
                    className="input-field  rounded-xl!  bg-gray-200/30 border-none resize-none pb-6 text-sm min-h-24"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
                    {messageText.length}/1024
                  </span>
                </div>
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {messageType}
                </label>
                <CannedMediaUploader
                  type={messageType}
                  media={media}
                  onChange={setMedia}
                />
                <div className="relative mt-4">
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    maxLength={1024}
                    rows={4}
                    placeholder="Optional caption"
                    className="input-field rounded-xl! bg-gray-200/30 border-none resize-none pb-6 text-sm min-h-20"
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
                    {messageText.length}/1024
                  </span>
                </div>
              </>
            )}
          </div>

          <div>
            <p className="block text-sm font-medium! text-gray-700 mb-1 capitalize">
              Message Preview
            </p>
            <div>
              {messageType !== "text" && media?.url && messageType === "image" && (
                <img
                  src={media.url}
                  alt="media"
                  className="w-full rounded-2xl border border-dashed h-50 object-cover"
                />
              )}
              <div
                className="bg-[#DCF8C6] whitespace-pre-wrap rounded-xl p-4 text-sm leading-5 text-gray-900"
                dangerouslySetInnerHTML={{
                  __html: formatWhatsappMessage(messageText),
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="rounded-xl py-1.5! text-sm bg-teal-900 hover:bg-teal-900/80"
              onClick={handleSubmit}
              disabled={submitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMessage;
