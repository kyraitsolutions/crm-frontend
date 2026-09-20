import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { EllipsisVertical, Phone, Trash2, Bot } from "lucide-react";
import { MdOutlinePeopleOutline } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import DeleteChatDialog from "./DeleteChatDialog";
import { conversationService } from "../services/conversation.service";
import { useAuthStore } from "@/stores";
import { ToastMessageService } from "@/services";
import { useConversationStore } from "../store/conversation.store";
import { whatsappLiveChatService } from "@/pages/Channels/whatsapp/services/whatsapp-live-chat.service";

type ChatHeaderProps = {
  name: string;
  conversationId: string;
  img?: string;
  platform?:
    | "whatsapp"
    | "instagram"
    | "chatbot"
    | "messenger"
    | "telegram"
    | "email";
  autoResolvePaused?: boolean;
  resolverLabel?: string;
};

const ChatHeader = ({
  name,
  img,
  conversationId,
  platform,
  autoResolvePaused,
  resolverLabel = "AI",
}: ChatHeaderProps) => {
  const { accountId } = useAuthStore();
  const toast = new ToastMessageService();
  const removeConversations = useConversationStore(
    (state) => state.removeConversations,
  );
  const clearLiveChatIntervention = useConversationStore(
    (state) => state.clearLiveChatIntervention,
  );
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resuming, setResuming] = useState(false);

  const handleResumeAutoResolve = async () => {
    if (!accountId || !conversationId) return;
    setResuming(true);
    try {
      await whatsappLiveChatService.resumeConversation(
        String(accountId),
        conversationId,
      );
      clearLiveChatIntervention(conversationId);
      toast.success(`${resolverLabel} will reply to this chat again`);
    } catch (error: any) {
      toast.error(error?.message || `Could not hand this chat back to ${resolverLabel}`);
    } finally {
      setResuming(false);
    }
  };

  const handleDelete = async (deleteContact: boolean) => {
    if (!accountId || !conversationId) return;
    setSaving(true);
    try {
      await conversationService.deleteConversations(String(accountId), {
        conversationIds: [conversationId],
        deleteContact,
      });
      removeConversations([conversationId]);
      toast.success("Chat moved to Recycle Bin");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Could not delete chat");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white px-3 py-2 drop-shadow-xs border-gray-200 relative">
      <div className="flex items-center gap-4">
        {img ? (
          <Avatar className="h-12 w-12 flex items-center justify-center bg-gray-100">
            <AvatarImage
              className="object-cover bg-orange-600 text-white"
              src={"https://ai-avatar-generator.com/avatars3/nature.png"}
            />
            <AvatarFallback className="bg-orange-600 text-white">
              {getFirstWordOfSentence("Ahadgf") || "A"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-12 bg-primary/10 rounded-full flex justify-center items-center shadow">
            <MdOutlinePeopleOutline size={24} className="text-primary" />
          </div>
        )}

        <div className="relative">
          <h1 className="text-sm font-semibold">{name}</h1>
        </div>

        <Phone size={18} className="text-gray-500 ml-auto" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="text-gray-500">
              <EllipsisVertical size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            {platform === "whatsapp" && autoResolvePaused && (
              <DropdownMenuItem className="cursor-pointer"  disabled={resuming} onClick={() => void handleResumeAutoResolve()}>
                <Bot size={16} />
                {resuming ? "Handing back..." : `Hand back to ${resolverLabel}`}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Trash2 size={16} />
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteChatDialog
        open={open}
        count={1}
        saving={saving}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ChatHeader;
