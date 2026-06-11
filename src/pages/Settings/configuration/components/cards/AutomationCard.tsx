import React from "react";
import { TRIGGER_OPTIONS } from "../../constants/automation.constants";
import type { Automation } from "../../store/automation.store";

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AutomationCard: React.FC<AutomationCardProps> = ({
  automation,
  onToggle,
  onDelete,
}) => {
  const triggerLabel =
    TRIGGER_OPTIONS.find((t) => t.value === automation.trigger)?.label ||
    automation.trigger;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all duration-150 group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-violet-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {automation.name}
          </p>
          <p className="text-xs text-gray-400 truncate">{triggerLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-3">
        {/* Active/Inactive badge */}
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full
            ${
              automation.isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-gray-100 text-gray-400"
            }`}
        >
          {automation.isActive ? "Active" : "Inactive"}
        </span>

        {/* Toggle */}
        <button
          onClick={() => onToggle(automation.id)}
          className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none
            ${automation.isActive ? "bg-primary" : "bg-gray-200"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
              ${automation.isActive ? "translate-x-4" : "translate-x-0"}`}
          />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(automation.id)}
          className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AutomationCard;
