import React, { useMemo } from "react";
import type { TriggerType } from "../../store/automation.store";
import {
  TRIGGER_OPTIONS,
  type TriggerOption,
} from "../../constants/automation.constants";
import { Button } from "@/components/ui/button";

interface SelectTriggerStepProps {
  selectedTrigger: TriggerType | null;
  onSelect: (trigger: TriggerType) => void;
  onNext: () => void;
}

const SelectTriggerStep: React.FC<SelectTriggerStepProps> = ({
  selectedTrigger,
  onSelect,
  onNext,
}) => {
  const grouped = useMemo(() => {
    const map = new Map<string, TriggerOption[]>();
    for (const option of TRIGGER_OPTIONS) {
      const list = map.get(option.group) || [];
      list.push(option);
      map.set(option.group, list);
    }
    return [...map.entries()];
  }, []);

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">
        Choose Trigger
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Select what event starts this automation
      </p>

      <div className="space-y-5">
        {grouped.map(([group, options]) => (
          <div key={group}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
              {group}
            </p>
            <div className="space-y-2">
              {options.map((option) => {
                const isSelected = selectedTrigger === option.value;
                return (
                  <div
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-150 cursor-pointer
                      ${
                        isSelected
                          ? "border-primary/20 bg-primary/6"
                          : "border-gray-200 bg-white hover:border-primary/40 hover:bg-violet-50/40"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                        ${isSelected ? "border-primary" : "border-gray-300"}`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${isSelected ? "text-primary" : "text-gray-700"}`}
                      >
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={onNext}
          disabled={!selectedTrigger}
          className="px-5 py-2 bg-primary/90 text-white text-sm font-medium rounded-2xl hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SelectTriggerStep;
