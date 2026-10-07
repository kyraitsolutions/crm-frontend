import React, { useEffect, useState } from "react";
import {
  CONDITION_FIELDS_VALUES,
  CONDITION_OPERATORS,
  TRIGGER_CONDITIONS_FIELDS,
  TRIGGER_OPTIONS,
} from "../../constants/automation.constants";
import type {
  AutomationCondition,
  TriggerType,
} from "../../store/automation.store";
import { X } from "lucide-react";
import { useConfigurationStore } from "../../store/configuration.store";
import { loadFieldData } from "../../utils/loadFieldData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamsStore } from "@/stores/team.store";
import { MultiSelect } from "@/components/ui/MultiSelect";

interface SetConditionStepProps {
  trigger: TriggerType | null;
  conditions: AutomationCondition[];
  onChange: (conditions: AutomationCondition[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const NEEDS_VALUES = new Set(["equals", "not_equals", "contains", "not_contains"]);

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

  const availableFields = trigger ? TRIGGER_CONDITIONS_FIELDS[trigger] : [];
  const triggerMeta = TRIGGER_OPTIONS.find((t) => t.value === trigger);

  const emptyCondition = (): AutomationCondition => ({
    field: availableFields[0] || "",
    operator: CONDITION_OPERATORS[0].value,
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

  const loadOptions = async (field: string) => {
    if (!field || optionsMap[field]) return;
    const options = await loadFieldData(field, {
      getConfigurationsByType: getConfigurationByType,
      getUsers: getTeams,
    });
    setOptionsMap((prev) => ({ ...prev, [field]: options }));
  };

  const handleFieldChange = async (index: number, field: string) => {
    updateCondition(index, { field, values: [] });
    await loadOptions(field);
  };

  useEffect(() => {
    // Prefetch options for existing conditions (edit mode)
    void (async () => {
      for (const condition of conditions) {
        if (condition.field) await loadOptions(condition.field);
      }
      if (!conditions.length && availableFields[0]) {
        await loadOptions(availableFields[0]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const canContinue = conditions.every((c) => {
    if (!c.field || !c.operator) return false;
    if (NEEDS_VALUES.has(c.operator) && (!c.values || c.values.length === 0)) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">
          {triggerMeta?.label || "Conditions"}
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Optional filters. Leave empty to run for every{" "}
          {triggerMeta?.label?.toLowerCase() || "event"}.
        </p>
      </div>

      <div className="space-y-3">
        {conditions.map((condition, index) => {
          const fieldConfig =
            CONDITION_FIELDS_VALUES[
              condition.field as keyof typeof CONDITION_FIELDS_VALUES
            ];
          const isTextField = fieldConfig?.type === "text";

          return (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl p-3 bg-gray-50 space-y-2"
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
                value={condition.field || ""}
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
                    values: NEEDS_VALUES.has(value) ? condition.values : [],
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPERATORS.map((operator) => (
                    <SelectItem key={operator.value} value={operator.value}>
                      {operator.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {NEEDS_VALUES.has(condition.operator) && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Value</label>
                {isTextField ? (
                  <Input
                    className="w-full input-field"
                    placeholder="Type a value and press Enter"
                    value=""
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      const next = (e.target as HTMLInputElement).value.trim();
                      if (!next) return;
                      if (condition.values.includes(next)) return;
                      updateCondition(index, {
                        values: [...condition.values, next],
                      });
                      (e.target as HTMLInputElement).value = "";
                    }}
                  />
                ) : (
                  <MultiSelect
                    options={optionsMap[condition.field] ?? []}
                    value={condition.values}
                    onChange={(values) => updateCondition(index, { values })}
                  />
                )}
                {isTextField && condition.values.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {condition.values.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() =>
                          updateCondition(index, {
                            values: condition.values.filter((x) => x !== v),
                          })
                        }
                        className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600"
                      >
                        {v} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })}
      </div>

      {availableFields.length > 0 && (
        <button
          onClick={addCondition}
          className="mt-3 flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary transition-colors"
        >
          + Add {conditions.length > 0 ? "another" : "a"} condition
        </button>
      )}

      {conditions.length === 0 && (
        <p className="mt-3 text-xs text-gray-500">
          No conditions → this automation runs every time the trigger fires.
        </p>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-5 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-2xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>

        <Button
          disabled={!canContinue}
          onClick={onNext}
          className="px-5 py-2 bg-primary/90 text-white text-sm font-medium rounded-2xl hover:bg-primary transition-colors cursor-pointer disabled:cursor-not-allowed!"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SetConditionStep;
