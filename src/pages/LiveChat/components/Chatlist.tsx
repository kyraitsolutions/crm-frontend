import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { MdChatBubble, MdOutlinePeopleOutline } from "react-icons/md";
import type { TConversation } from "../types/conversation.type";
import {
  Bot,
  LucideInstagram,
  MessageSquareText,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { useConversationStore } from "../store/conversation.store";
import { ChatListSkeleton } from "./skeletons/ChatListSkeleton";
import Loader from "@/components/Loader";
import { formatTime } from "@/utils/date-utils";
import { buildAndGetVisitorDisplayNameByVisitorId } from "../utils/getVisitorDisplayName";
import { highlightText } from "@/utils/highlightText";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/types";
import { ToastMessageService } from "@/services";
import { whatsappService } from "@/pages/Channels/whatsapp/services/whatsapp.service";
import { useAuthStore } from "@/stores";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteChatDialog from "./DeleteChatDialog";
import { conversationService } from "../services/conversation.service";

interface ChatListProps {
  activeFilter: string;
  conversationList: TConversation[] | [];
}

const Chatlist = ({ conversationList, activeFilter }: ChatListProps) => {
  const accountId = useAuthStore((state) => state.accountId);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    isRefetching,
    isLoadingMore,
    setSelectConversationId,
    conversationQuery,
    removeConversations,
  } = useConversationStore((state) => state);

  const toastMessageService = new ToastMessageService();
  const [isContactSyncing, setIsContactSyncing] = useState(false);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDelete = async (deleteContact: boolean) => {
    if (!accountId || !selectedIds.length) return;
    setSaving(true);
    try {
      await conversationService.deleteConversations(String(accountId), {
        conversationIds: selectedIds,
        deleteContact,
      });
      removeConversations(selectedIds);
      toastMessageService.success("Chats moved to Recycle Bin");
      setDeleteOpen(false);
      setSelectMode(false);
      setSelectedIds([]);
    } catch (error: any) {
      toastMessageService.error(error?.message || "Could not delete chats");
    } finally {
      setSaving(false);
    }
  };

  const handleSyncContacts = async () => {
    setIsContactSyncing(true);
    try {
      const response = await whatsappService.syncContacts(String(accountId));

      if (response?.status === 200) {
        toastMessageService.success(
          response.message || "Contacts synced successfully",
        );
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastMessageService.apiError(err.message || "Failed to sync contacts");
      }
    } finally {
      setIsContactSyncing(false);
    }
  };

  if (isRefetching) {
    return <ChatListSkeleton />;
  }

  if (!conversationList?.length) {
    return (
      <div className="flex h-[calc(100vh-205px)] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MessageSquareText size={24} className="text-primary" />
        </div>

        <h2 className="mt-5 text-sm font-semibold text-gray-800">
          No Conversations Found
        </h2>

        <p className="mt-2 max-w-70 text-xs leading-relaxed text-gray-500">
          There are no conversations available right now. Try changing filters
          or wait for new incoming chats.
        </p>

        {activeFilter === "whatsapp" && (
          <Button
            disabled={isContactSyncing}
            onClick={handleSyncContacts}
            className="actions-btn mt-2 px-4! py-1.5! flex! items-center!"
          >
            Sync Contacts{" "}
            <span className={`${isContactSyncing && "animate-spin"}`}>
              <RefreshCcw className="size-4" />
            </span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        {selectMode ? (
          <>
            <p className="text-xs text-gray-500">{selectedIds.length} selected</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-7 rounded-lg px-2 text-xs"
                onClick={() => {
                  setSelectMode(false);
                  setSelectedIds([]);
                }}
              >
                Cancel
              </Button>
              <Button
                className="h-7 rounded-lg px-2 text-xs bg-red-600 hover:bg-red-600/90"
                disabled={!selectedIds.length}
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="ml-auto text-xs text-teal-800"
            onClick={() => setSelectMode(true)}
          >
            Select
          </button>
        )}
      </div>
      {conversationList.map((conv) => {
        const name =
          conv?.contact?.name ||
          buildAndGetVisitorDisplayNameByVisitorId(conv?.visitorId);
        const phoneNumber = conv?.contact?.phoneNumber || "";
        const previewText = conv.searchPreview || null;
        const lastMessage = conv?.lastMessage?.text || "No messages yet";

        return (
          <div
            key={conv.id}
            onClick={() => {
              if (selectMode) {
                toggleSelected(conv.id);
                return;
              }
              setActiveChat(conv.id);
              setSelectConversationId(conv.id, conv?.matchedMessageId);
            }}
            className={`flex gap-3 ${activeChat === conv.id && "bg-primary/10"} hover:bg-primary/10 cursor-pointer group items-center w-full py-4 px-4 border-b border-gray-100 transition-all`}
          >
            {selectMode && (
              <Checkbox
                checked={selectedIds.includes(conv.id)}
                onClick={(event) => event.stopPropagation()}
                onCheckedChange={() => toggleSelected(conv.id)}
              />
            )}
            <div className="relative">
              <Avatar className="size-11 border border-gray-300 flex items-center justify-center bg-gray-100">
                {conv?.contact?.profilePicture ? (
                  <AvatarImage
                    className="object-cover"
                    src={conv.contact?.profilePicture}
                  />
                ) : (
                  <MdOutlinePeopleOutline size={24} className="text-gray-400" />
                )}
              </Avatar>
              <span className="absolute -bottom-1 -right-1 size-5 flex items-center justify-center rounded-full ring-2 ring-white bg-green-500 text-white">
                {conv.platform === "chatbot" ? (
                  <Bot size={12} />
                ) : conv.platform === "instagram" ? (
                  <LucideInstagram size={14} />
                ) : conv.platform === "whatsapp" ? (
                  <MdChatBubble size={14} color="#ffffff" />
                ) : null}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={`truncate flex flex-col gap-1 ${
                    activeChat === conv.id ? "font-semibold" : "font-medium"
                  } text-gray-700 text-sm`}
                >
                  {name}
                  {phoneNumber && (
                    <span className="text-xs text-primary">{phoneNumber}</span>
                  )}
                </h3>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatTime(String(conv?.updatedAt))}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                {previewText ? (
                  highlightText(previewText, conversationQuery?.search)
                ) : (
                  <p className="text-xs text-gray-500 ">
                    {lastMessage?.slice(0, 30)}...
                  </p>
                )}
                {conv.unreadCount > 0 && (
                  <span className="min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-primary/90 text-white text-xs font-medium">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {isLoadingMore && (
        <div className="flex justify-center py-2.5">
          <Loader color="#435866" />
        </div>
      )}

      <DeleteChatDialog
        open={deleteOpen}
        count={selectedIds.length}
        saving={saving}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Chatlist;
