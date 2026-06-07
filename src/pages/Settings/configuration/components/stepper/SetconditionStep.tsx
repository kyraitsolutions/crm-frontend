import React, { useEffect, useState } from "react";
import {
  CONDITION_OPERATORS,
  TRIGGER_CONDITIONS_FIELDS,
} from "../../constants/automation.constants";
import type {
  AutomationCondition,
  TriggerType,
} from "../../store/automation.store";
import { X } from "lucide-react";
import { useConfigurationStore } from "../../store/configuration.store";
import { loadFieldData } from "../../utils/loadFieldData";
import { Button } from "@/components/ui/button";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Select } from "@radix-ui/react-select";
import { useTeamsStore } from "@/stores/team.store";
import { MultiSelect } from "@/components/ui/MultiSelect";

interface SetConditionStepProps {
  trigger: TriggerType | null;
  conditions: AutomationCondition[];
  onChange: (conditions: AutomationCondition[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const SetConditionStep: React.FC<SetConditionStepProps> = ({
  trigger,
  conditions,
  onChange,
  onBack,
  onNext,
}) => {
  const { getConfigurationByType } = useConfigurationStore();
  const { getTeams } = useTeamsStore();

  const [optionsMap, setOptionsMap] = useState<
    Record<string, { key: string; label: string }[]>
  >({});

  const emptyCondition = (): AutomationCondition => ({
    field: trigger ? TRIGGER_CONDITIONS_FIELDS[trigger][0] : "",
    operator: CONDITION_OPERATORS[0],
    values: [],
  });

  const addCondition = () => onChange([...conditions, emptyCondition()]);

  const updateCondition = (
    index: number,
    patch: Partial<AutomationCondition>,
  ) => {
    const updated = conditions.map((c, i) =>
      i === index ? { ...c, ...patch } : c,
    );
    onChange(updated);
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const handleFieldChange = async (index: number, field: string) => {
    updateCondition(index, {
      field,
      values: [],
    });

    const options = await loadFieldData(field, {
      getConfigurationsByType: getConfigurationByType,
      getUsers: getTeams,
    });

    setOptionsMap((prev) => ({
      ...prev,
      [field]: options as { key: string; label: string }[],
    }));
  };

  const availableFields = trigger ? TRIGGER_CONDITIONS_FIELDS[trigger] : [];

  useEffect(() => {
    handleFieldChange(0, availableFields[0]);
  }, []);

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">
        Lead Status Changed
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Define conditions that must be met to trigger this automation
      </p>

      <div className="space-y-3">
        {conditions?.map((condition, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Condition {index + 1}
              </span>
              <button
                onClick={() => removeCondition(index)}
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Field</label>
              <Select
                value={condition.field}
                onValueChange={(value) => handleFieldChange(index, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>

                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <select
                value={condition.field}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
              >
                {availableFields?.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select> */}
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Operator
              </label>
              <Select
                value={condition.operator}
                onValueChange={(value) =>
                  updateCondition(index, {
                    operator: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {CONDITION_OPERATORS.map((operator) => (
                    <SelectItem key={operator} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <select
                value={condition.operator}
                onChange={(e) =>
                  updateCondition(index, { operator: e.target.value })
                }
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
              >
                {CONDITION_OPERATORS.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select> */}
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Value</label>
              <MultiSelect
                options={optionsMap[condition.field] ?? []}
                value={condition.values}
                onChange={(values) => updateCondition(index, { values })}
              />
              {/* <Select
                value={condition.value}
                onValueChange={(value) => updateCondition(index, { value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>

                <SelectContent>
                  {optionsMap[condition.field]?.map((opt) => (
                    <SelectItem key={opt.key} value={opt.key}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              {/* <select
                value={condition.value}
                onChange={(e) =>
                  updateCondition(index, { value: e.target.value })
                }
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
              >
                <option value="">Select value</option>
                {optionsMap[condition.field]?.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCondition}
        className="mt-3 flex items-center gap-1.5 text-sm text-violet-600 font-medium hover:text-violet-700 transition-colors"
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
        Add another condition
      </button>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-5 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>

        <Button
          disabled={!conditions.length}
          onClick={onNext}
          className="px-5 py-2 bg-primary/90 text-white text-sm font-medium rounded-lg hover:bg-primary transition-colors cursor-pointer disabled:cursor-not-allowed!"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SetConditionStep;
