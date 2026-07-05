import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores";
import { formatDate } from "@/utils/date-utils";
import { timeAgo } from "@/utils/date.utils";
import {
  Clock,
  FileText,
  // Link,
  MessageCircle,
  Phone,
  Plus,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useLeadsStore } from "../../store/lead.store";
import type { ILead } from "../../types/lead.type";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";

export type ActivitySource =
  | "phone_call"
  | "message"
  | "note"
  | "email"
  | "whatsapp";
export interface TimelineItem {
  activitySource: ActivitySource;
  message: string;
  attachment: string | null;
  createdAt: string; // ISO string from server
  createdBy: string; // userId (string for now)
}
// const timelineConfig = {
//   phone_call: {
//     icon: Phone,
//     bg: "bg-purple-500",
//   },
//   message: {
//     icon: MessageCircle,
//     bg: "bg-fuchsia-500",
//   },
//   note: {
//     icon: FileText,
//     bg: "bg-indigo-500",
//   },
//   whatsapp: {
//     icon: Settings,
//     bg: "bg-gray-500",
//   },
//   user: {
//     icon: UserPlus,
//     bg: "bg-gray-600",
//   },
// };

const activityOptions = [
  { value: "phone_call", label: "Phone Call", icon: Phone },
  { value: "message", label: "Message", icon: MessageCircle },
  { value: "note", label: "Note", icon: FileText },
  { value: "email", label: "Email", icon: FileText },
  { value: "whatsapp", label: "Whatsapp", icon: FileText },
] as const;
const activityMap = {
  phone_call: "Phone Call",
  message: "Message",
  note: "Note",
  email: "Email",
  whatsapp: "Whatsapp",
} as const;
const Notes = ({ lead }: { lead: ILead }) => {
  const toastService = new ToastMessageService();
  const { accountId, user } = useAuthStore((state) => state);
  const { updateLeadField } = useLeadsStore((state) => state);

  const [activitySource, setActivitySource] =
    useState<ActivitySource>("phone_call");
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [showNotes, setShowNotes] = useState(true);
  //   const [notes, setNotes] = useState<TimelineItem[]>([]);
  const [sortType, setSortType] = useState<"recent_first" | "recent_last">(
    "recent_first",
  );

  const [loading, setLoading] = useState(false);

  const notePayload = {
    activitySource: activitySource,
    attachment: "",
    message: noteTitle,
    createdBy: user?.id,
    createdAt: new Date().toISOString(),
  };

  const handleSaveNote = async () => {
    try {
      if (!noteTitle.trim()) return;

      setLoading(true);

      const payload = [...(lead.notes || []), notePayload];
      const response = await updateLeadField(
        String(accountId),
        String(lead.id),
        "notes",
        payload,
      );
      if (response && response.status === 200) {
        toastService.success(response?.message || "Lead updated successfully!");
      }

      // setNotes((prev) => [notePayload, ...prev]);
      setNoteTitle("");
      setShowNoteEditor(false);
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastService.error(err.message || "Failed to update lead");
      }
    } finally {
      setLoading(false);
    }
  };

  const sortedNotes = [...(lead?.notes || [])].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();

    const bTime = new Date(b.createdAt).getTime();

    return sortType === "recent_first"
      ? bTime - aTime // newest first
      : aTime - bTime; // oldest first
  });

  const handleSortChange = (value: "recent_first" | "recent_last") => {
    setSortType(value);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div
        onClick={() => {
          setShowNotes((prev) => !prev);
        }}
        className={`flex cursor-pointer items-center justify-between px-5 py-2.5 ${showNotes && "border-b"} border-[#e5e7eb]`}
      >
        <div className="flex justify-between items-center w-full">
          <h2 className="font-semibold text-md ">Notes</h2>

          <Select
            onValueChange={(value: "recent_first" | "recent_last") =>
              handleSortChange(value)
            }
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Recent First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent_first">Recent First</SelectItem>
              <SelectItem value="recent_last">Recent Last</SelectItem>
            </SelectContent>
          </Select>

          {/* <select
            onClick={(e) => e.stopPropagation()}
            value={sortType}
            onChange={handleSortChange}
            className="border border-primary  font-medium rounded-xl px-4 py-1 text-sm bg-primary/10 text-primary outline-none  hover:bg-primary/20"
          >
            Recent Last ▾<option value="recent_first">Recent First</option>
            <option value="recent_last">Recent Last</option>
          </select> */}
        </div>
      </div>

      {showNotes && (
        <div className="p-5">
          {/* Existing Notes */}
          <div className="space-y-7 mb-4 max-h-100 overflow-y-auto">
            {sortedNotes?.map((note) => (
              <div key={note.message} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center text-white font-medium text-md shrink-0">
                  {note?.createdBy?.charAt(0) || note.message?.charAt(0)}
                </div>
                <div className="flex flex-col gap-2">
                  {/* Avatar */}

                  <div className="capitalize text-xs text-gray-600 bg-gray-200 w-fit px-2 py-1 rounded-xl flex items-center gap-1">
                    <span>Had conversation on</span>{" "}
                    {activityMap[note.activitySource]}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-sm font-medium capitalize">
                      {note.message}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-[#5b6b82] flex-wrap">
                      <span>Lead</span>

                      <span className="text-[#4f46e5] cursor-pointer hover:underline">
                        {lead.name}
                      </span>

                      <span>•</span>

                      <span
                        onClick={() => setShowNoteEditor(true)}
                        className="cursor-pointer"
                      >
                        Add Note
                      </span>

                      <span>•</span>

                      <span></span>

                      <ButtonWithTitle
                        title={formatDate(note.createdAt)}
                        className="flex items-center gap-1"
                      >
                        <Clock size={14} />
                        {timeAgo(note.createdAt)}
                      </ButtonWithTitle>

                      {/* <span>by {note.createdBy}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Note Button */}
          {!showNoteEditor && (
            <Button
              onClick={() => setShowNoteEditor(true)}
              className="actions-btn w-fit! px-2!"
            >
              <Plus /> Add a note
            </Button>
          )}

          {/* Note Editor */}
          {showNoteEditor && (
            <div className="border border-primary/40 rounded-xl max-w-4xl overflow-hidden">
              {/* Textarea */}
              <div className="p-4">
                <div className="flex items-center justify-end mb-2">
                  {/* <label className="block text-[#8b95a7] font-medium">
                    Title
                  </label> */}
                  <Select
                    value={activitySource}
                    onValueChange={(value) =>
                      setActivitySource(value as ActivitySource)
                    }
                  >
                    <SelectTrigger className="actions-btn px-4!">
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>

                    <SelectContent>
                      {activityOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            {/* <opt.icon size={14} /> */}
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <textarea
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full min-h-20 resize-none outline-none text-md"
                  placeholder="Write your note..."
                />
              </div>

              {/* Footer */}
              <div className="border-t bg-[#f8f9fc] px-4 py-2 flex items-center justify-between">
                {/* <div className="flex items-center gap-4 text-gray-700">
                  <button className="text-lg font-serif">T</button>

                  <button className="text-lg">
                    <Link size={16} />
                  </button>
                </div> */}

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowNoteEditor(false);
                      setNoteTitle("");
                    }}
                    className="actions-btn px-2!"
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={!noteTitle || loading}
                    onClick={handleSaveNote}
                    className="rounded-xl py-1.5!"
                  >
                    <Save /> Save {loading && <Loader />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
