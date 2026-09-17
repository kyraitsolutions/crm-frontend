import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { useMessageStore } from "../store/message.store";
import { extractSharedMedia } from "../utils/extract-shared-media.utils";
import { useConversationStore } from "../store/conversation.store";
import { buildAndGetVisitorDisplayNameByVisitorId } from "../utils/getVisitorDisplayName";
import { formatDate } from "@/utils/date.utils";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { getWhatsappMediaUrl } from "../utils/getWhatsappMediaUrl";
import { useAuthStore } from "@/stores";
import Tags from "@/components/Tag/Tags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfigurationStore } from "@/pages/Settings/configuration/store/configuration.store";
import { conversationService } from "../services/conversation.service";
import { ToastMessageService } from "@/services";
import type {
  TConversationFollowUp,
  TConversationTag,
} from "../types/conversation.type";
import { Check, Plus } from "lucide-react";

const toast = new ToastMessageService();

const normalizeTags = (tags: unknown): TConversationTag[] => {
  if (!Array.isArray(tags)) return [];
  return tags.flatMap((tag) => {
    if (typeof tag === "string" && tag.trim()) {
      return [{ label: tag, color: "#84cc16" }];
    }
    if (tag && typeof tag === "object" && "label" in tag) {
      const label = String((tag as TConversationTag).label || "").trim();
      if (!label) return [];
      return [
        {
          label,
          color: String((tag as TConversationTag).color || "#84cc16"),
        },
      ];
    }
    return [];
  });
};

const MESSAGE_STATUSES = new Set([
  "sent",
  "delivered",
  "read",
  "received",
  "failed",
]);

const normalizeFollowUps = (items: unknown): TConversationFollowUp[] => {
  if (!Array.isArray(items)) return [];
  return items.map((item: any) => ({
    id: String(item?.id || item?._id || ""),
    note: String(item?.note || ""),
    dueAt: item?.dueAt || null,
    completedAt: item?.completedAt || null,
    createdAt: item?.createdAt,
  }));
};

const ChatProfile = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const { messages } = useMessageStore((state) => state);
  const { conversations, selectedConversationId, patchConversation } =
    useConversationStore((state) => state);
  const getConfigurationByType = useConfigurationStore(
    (state) => state.getConfigurationByType,
  );
  const sharedMedia = extractSharedMedia(messages);
  const [statuses, setStatuses] = useState<
    { key: string; label: string; color?: string }[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpDue, setFollowUpDue] = useState("");

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  const tags = useMemo(
    () => normalizeTags(selectedConversation?.tags),
    [selectedConversation?.tags],
  );

  const inboundCount =
    selectedConversation?.inboundCount ??
    messages.filter((item) => item.direction === "inbound").length;
  const outboundCount =
    selectedConversation?.outboundCount ??
    messages.filter((item) => item.direction === "outbound").length;

  useEffect(() => {
    void getConfigurationByType("conversation-status")
      .then((values) => {
        const items = (values || [])
          .map((item: any) => ({
            key: String(item.key || "").toLowerCase(),
            label: String(item.label || item.key || ""),
            color: item.color,
          }))
          .filter((item) => item.key);
        setStatuses(
          items.length
            ? items
            : [
              { key: "open", label: "Open", color: "#28a745" },
              { key: "pending", label: "Pending", color: "#ffc107" },
              { key: "closed", label: "Closed", color: "#dc3545" },
            ],
        );
      })
      .catch(() => {
        setStatuses([
          { key: "open", label: "Open", color: "#28a745" },
          { key: "pending", label: "Pending", color: "#ffc107" },
          { key: "closed", label: "Closed", color: "#dc3545" },
        ]);
      });
  }, [getConfigurationByType]);

  if (!selectedConversation) return null;

  const displayName =
    selectedConversation?.contact?.name ||
    selectedConversation?.contact?.phoneNumber ||
    buildAndGetVisitorDisplayNameByVisitorId(
      String(selectedConversation?.visitorId),
    );
  const rawStatus = String(selectedConversation.status || "open").toLowerCase();
  const currentStatus = MESSAGE_STATUSES.has(rawStatus) ? "open" : rawStatus;
  const followUps = normalizeFollowUps(selectedConversation.followUps);
  const openFollowUps = followUps.filter((item) => !item.completedAt);
  const doneFollowUps = followUps.filter((item) => item.completedAt);
  const statusMeta =
    statuses.find((item) => item.key === currentStatus) || {
      key: currentStatus,
      label: currentStatus,
      color: "#6B7280",
    };
  const lastMessage = selectedConversation.lastMessage?.text || "No messages yet";
  const lastFrom =
    selectedConversation.lastMessage?.from === "user"
      ? "Customer"
      : selectedConversation.lastMessage?.from === "me" ||
        selectedConversation.lastMessage?.from === "bot"
        ? "Team"
        : selectedConversation.lastMessage?.from || "";

  const persist = async (payload: {
    status?: string;
    tags?: TConversationTag[];
    followUps?: TConversationFollowUp[];
  }) => {
    if (!accountId || !selectedConversation.id) return;
    setSaving(true);
    try {
      const response = await conversationService.updateConversation(
        String(accountId),
        selectedConversation.id,
        payload,
      );
      const doc = response.data?.doc || {};
      patchConversation(selectedConversation.id, {
        status: doc.status || payload.status || selectedConversation.status,
        tags: normalizeTags(doc.tags || payload.tags),
        followUps: normalizeFollowUps(doc.followUps || payload.followUps),
      });
      toast.success("Chat profile updated");
    } catch (error: any) {
      toast.error(error?.message || "Could not update chat profile");
    } finally {
      setSaving(false);
    }
  };

  const addFollowUp = () => {
    if (!followUpNote.trim() && !followUpDue) return;
    void persist({
      followUps: [
        ...followUps,
        {
          note: followUpNote.trim(),
          dueAt: followUpDue || null,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    setFollowUpNote("");
    setFollowUpDue("");
  };

  return (
    <div className="flex flex-col px-3 pb-6">
      <div>
        <h1 className="text-sm text-gray-500 uppercase font-semibold">
          Customer Profile
        </h1>
        <div className="flex flex-col items-center mt-5 justify-center gap-2 py-4 bg-gray-100 rounded-2xl px-3">
          <div>
            {selectedConversation?.contact?.profilePicture ? (
              <Avatar className="h-24 w-24 flex items-center justify-center bg-gray-100">
                <AvatarImage
                  className="object-cover"
                  src={selectedConversation.contact.profilePicture}
                />
                <AvatarFallback className="bg-orange-600 text-white">
                  {getFirstWordOfSentence(String(displayName)) || "A"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="size-20 bg-gray-100 rounded-full border border-primary/20 flex justify-center items-center shadow">
                <MdOutlinePeopleOutline size={30} className="text-gray-400" />
              </div>
            )}
          </div>
          <h1 className="text-sm font-bold text-center">{displayName}</h1>
          {selectedConversation?.contact?.phoneNumber ? (
            <p className="text-xs text-gray-500">
              {selectedConversation.contact.phoneNumber}
            </p>
          ) : null}
          <div className="flex gap-3 items-center flex-wrap justify-center">
            <p className="text-xs text-gray-500">
              Joined: {formatDate(String(selectedConversation?.createdAt))}
            </p>
            <span
              className="text-xs px-2 py-0.5 rounded-2xl border"
              style={{
                color: statusMeta.color,
                borderColor: statusMeta.color,
                background: `${statusMeta.color}14`,
              }}
            >
              {statusMeta.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 py-4">
        {sharedMedia.slice(0, 5).map((media) => (
          <div
            key={media.messageId}
            className="w-16 h-16 rounded-2xl overflow-hidden"
          >
            {media.type === "image" && (
              <img
                src={
                  media.url || getWhatsappMediaUrl(String(accountId), media.id)
                }
                alt=""
                className="w-full h-full object-cover"
              />
            )}
            {media.type === "video" && (
              <video src={media.url} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
        {sharedMedia.length > 5 && (
          <div className="bg-gray-200 rounded-2xl w-16 h-16 flex justify-center items-center text-lg text-gray-500">
            +{sharedMedia.length - 5}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-sm text-gray-500 uppercase font-semibold mb-2">
            Chat status
          </h2>
          <Select
            value={currentStatus}
            disabled={saving}
            onValueChange={(status) => void persist({ status })}
          >
            <SelectTrigger className="rounded-xl w-full bg-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {(statuses.some((item) => item.key === currentStatus)
                ? statuses
                : [
                  ...statuses,
                  { key: currentStatus, label: currentStatus },
                ]
              ).map((status) => (
                <SelectItem key={status.key} value={status.key}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h2 className="text-sm text-gray-500 uppercase font-semibold mb-2">
            Tags
          </h2>
          <Tags
            tags={tags}
            onChange={(next) => {
              const value = typeof next === "function" ? next(tags) : next;
              patchConversation(selectedConversation.id, { tags: value });
            }}
            onSave={(next) => persist({ tags: next })}
          />
        </div>

        <div>
          <h2 className="text-sm text-gray-500 uppercase font-semibold mb-2">
            Follow-ups
          </h2>
          <div className="space-y-2">
            {openFollowUps.map((item, index) => {
              const itemIndex = followUps.findIndex((followUp) => followUp === item);
              return (
                <div
                  key={item.id || `${item.note}-${index}`}
                  className="rounded-2xl border bg-white px-3 py-2 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.note || "Follow-up"}</p>
                      {item.dueAt ? (
                        <p className="text-xs text-gray-500">
                          Due {formatDate(String(item.dueAt))}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        void persist({
                          followUps: followUps.map((followUp, followIndex) =>
                            followIndex === itemIndex
                              ? {
                                ...followUp,
                                completedAt: new Date().toISOString(),
                              }
                              : followUp,
                          ),
                        })
                      }
                      className="text-xs text-primary flex items-center gap-1"
                    >
                      <Check size={14} />
                      Done
                    </button>
                  </div>
                </div>
              );
            })}
            {doneFollowUps.length ? (
              <p className="text-xs text-gray-400">
                {doneFollowUps.length} completed
              </p>
            ) : null}
            <div className="rounded-2xl border bg-white p-3 space-y-2">
              <input
                value={followUpNote}
                onChange={(event) => setFollowUpNote(event.target.value)}
                placeholder="Add a follow-up note"
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={followUpDue}
                  onChange={(event) => setFollowUpDue(event.target.value)}
                  className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
                />
                <button
                  type="button"
                  disabled={saving || (!followUpNote.trim() && !followUpDue)}
                  onClick={addFollowUp}
                  className="text-sm text-white bg-primary rounded-xl px-3 py-2 flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm text-gray-500 uppercase font-semibold mb-2">
            Conversation
          </h2>
          <div className="rounded-2xl border bg-white divide-y text-sm">
            <div className="flex justify-between gap-3 px-3 py-2">
              <span className="text-gray-500">Score</span>
              <span className="font-medium">
                {selectedConversation.score || 0}
                {selectedConversation.scoreLevel
                  ? ` · ${selectedConversation.scoreLevel}`
                  : ""}
              </span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2">
              <span className="text-gray-500">Last message</span>
              <span className="font-medium text-right max-w-[160px] truncate">
                {lastFrom ? `${lastFrom}: ` : ""}
                {lastMessage}
              </span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2">
              <span className="text-gray-500">Customer messages</span>
              <span className="font-medium">{inboundCount}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2">
              <span className="text-gray-500">Messages sent</span>
              <span className="font-medium">{outboundCount}</span>
            </div>
            <div className="flex justify-between gap-3 px-3 py-2">
              <span className="text-gray-500">Total messages</span>
              <span className="font-medium">
                {selectedConversation.totalMessages || inboundCount + outboundCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
