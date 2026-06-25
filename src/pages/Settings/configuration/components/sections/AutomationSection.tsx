import React from "react";
import AutomationCard from "../cards/AutomationCard";
import { useAutomationStore } from "../../store/automation.store";
import CreateAutomationStepper from "../stepper/CreateAutomationStepper";

const AutomationSection: React.FC = () => {
  const {
    automations,
    isCreating,
    setIsCreating,
    toggleAutomation,
    deleteAutomation,
  } = useAutomationStore();

  return (
    <div className="w-full h-full space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Automations</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {automations.length} automation{automations.length !== 1 ? "s" : ""}{" "}
            configured
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-violet-200"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Automation
        </button>
      </div>

      {/* Empty state */}
      {automations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600">
            No automations yet
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Create your first automation to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {automations.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              onToggle={toggleAutomation}
              onDelete={(id) => deleteAutomation?.(id)}
            />
          ))}
        </div>
      )}

      {/* Stepper modal */}
      {isCreating && <CreateAutomationStepper />}
    </div>
  );
};

export default AutomationSection;
