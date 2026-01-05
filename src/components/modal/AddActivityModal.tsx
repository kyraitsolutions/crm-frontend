import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ActivitySource, TimelineItem } from "@/pages/leads-center.page";
import { SelectValue } from "@radix-ui/react-select";
import { FileText, MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

const activityOptions = [
  { value: "phone_call", label: "Phone Call", icon: Phone },
  { value: "message", label: "Message", icon: MessageCircle },
  { value: "note", label: "Note", icon: FileText },
] as const;

interface AddActivityModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (activity: Omit<TimelineItem, "id">) => void;
}

export const AddActivityModal = ({
  open,
  onClose,
  onSave,
}: AddActivityModalProps) => {
  const [activitySource, setActivitySource] =
    useState<ActivitySource>("phone_call");
  const [message, setMessage] = useState("");
  const [createdAt] = useState(new Date().toISOString());

  const SelectedIcon = activityOptions.find(
    (a) => a.value === activitySource
  )?.icon;

  const handleSave = () => {
    onSave({
      activitySource,
      message,
      attachment: null,
      createdAt,
      createdBy: "current-user-id",
    });

    setMessage("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Add Activity
            </DialogTitle>
            <DialogClose className="cursor-pointer">
              <X size={18} />
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Activity Type */}
          <div className="flex items-center gap-3 border rounded-lg px-3 py-2">
            {/* Icon */}
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-purple-100">
              {SelectedIcon && <SelectedIcon size={16} />}
            </div>

            {/* Select */}
            <Select
              value={activitySource}
              onValueChange={(value) =>
                setActivitySource(value as ActivitySource)
              }
            >
              <SelectTrigger
                className="
        flex-1
        border-none
        bg-transparent
        px-0
        h-auto
        shadow-none
        text-sm
        font-medium
        focus:ring-0
      "
              >
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

          {/* Message */}
          <textarea
            rows={5}
            placeholder="Add optional details here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              p-3
              text-sm
              resize-none
              outline-none
              focus:ring-2 focus:ring-purple-300
            "
          />

          {/* Date */}
          {/* <div className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
            <span>Today</span>
            <span className="text-gray-500">
              {new Date(createdAt).toLocaleTimeString()}
            </span>
          </div> */}

          {/* Attachment */}
          {/* <button className="flex items-center gap-2 w-full rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600">
            <Paperclip size={16} />
            Add Attachment
          </button> */}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700"
            onClick={handleSave}
            disabled={!message.trim()}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
