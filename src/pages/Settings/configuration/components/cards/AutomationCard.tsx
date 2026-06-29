import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRIGGER_OPTIONS } from "../../constants/automation.constants";
import type { Automation } from "../../store/automation.store";
import { Trash2, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "draft" | "published") => void;
}

const AutomationCard: React.FC<AutomationCardProps> = ({
  automation,
  onToggle,
  onDelete,
  onStatusChange,
}) => {
  const triggerLabel =
    TRIGGER_OPTIONS.find((t) => t.value === automation.trigger)?.label ??
    automation.trigger;

  const statusClasses =
    automation.status === "published"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="group flex items-center justify-between rounded-xl border border-primary/15 bg-white px-4 py-3 transition-all duration-150 hover:bg-gray-100">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
          <Workflow size={12} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {automation.name}
          </p>

          <p className="truncate text-xs text-gray-500">{triggerLabel}</p>
        </div>
      </div>

      <div className="ml-4 flex items-center gap-3">
        {/* Status */}
        <Select
          value={automation.status}
          onValueChange={(value) =>
            onStatusChange(automation.id, value as "draft" | "published")
          }
        >
          <SelectTrigger
            className={`text-xs rounded-full h-6! ${statusClasses}`}
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        {/* Active */}
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            automation.isActive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {automation.isActive ? "Active" : "Inactive"}
        </span>

        {/* Toggle */}
        <Button
          onClick={() => onToggle(automation.id, !automation.isActive)}
          className={`relative h-5! w-9 py-1! rounded-full transition-colors ${
            automation.isActive ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
              automation.isActive ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </Button>

        {/* Delete */}
        <Button
          onClick={() => onDelete(automation.id)}
          className="bg-transparent! transition-colors group-hover:opacity-100 hover:text-red-500"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default AutomationCard;
