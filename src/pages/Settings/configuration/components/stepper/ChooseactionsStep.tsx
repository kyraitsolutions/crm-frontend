import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamsStore } from "@/stores/team.store";
import React, { useState } from "react";
import { ACTION_OPTIONS } from "../../constants/automation.constants";
import type {
  ActionType,
  AutomationAction,
} from "../../store/automation.store";

interface ChooseActionsStepProps {
  actions: AutomationAction[];
  onChange: (actions: AutomationAction[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const ACTION_CONFIG_FIELDS: Record<
  ActionType,
  {
    label: string;
    key: string;
    options?: string[];
    type?: string;
    types?: string;
  }[]
> = {
  "assign-lead-to-user": [{ label: "Assign To", key: "user", type: "users" }],
  "create-task": [
    {
      label: "Task Title",
      key: "title",
      type: "text",
    },
    {
      label: "Description",
      key: "description",
      type: "textarea",
    },
    {
      label: "Priority",
      key: "priority",
      type: "select",
      options: ["Low", "Medium", "High"],
    },
    {
      label: "Due In",
      key: "dueIn",
      type: "select",
      options: ["1 Day", "3 Days", "7 Days", "14 Days"],
    },
    {
      label: "Assign To",
      key: "assignedTo",
      type: "users",
    },
  ],
  "send-notification": [
    // { label: "Automation Name", key: "name" },
    {
      label: "Notify",
      key: "target",
      options: ["Sales Manager", "Lead Owner", "All Team"],
    },
  ],
};

const emptyAction = (): AutomationAction => ({
  type: "assign-lead-to-user",
  config: {},
});

const ChooseActionsStep: React.FC<ChooseActionsStepProps> = ({
  actions,
  onChange,
  onBack,
  onNext,
}) => {
  console.log(actions);
  const { getTeams } = useTeamsStore();
  const addAction = () => onChange([...actions, emptyAction()]);

  const [users, setUsers] = useState<{ label: string; key: string }[]>([]);

  const updateAction = (index: number, patch: Partial<AutomationAction>) => {
    onChange(actions.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  };

  const updateActionConfig = (index: number, key: string, value: string) => {
    const action = actions[index];
    onChange(
      actions.map((a, i) =>
        i === index ? { ...a, config: { ...action.config, [key]: value } } : a,
      ),
    );
  };

  const removeAction = (index: number) =>
    onChange(actions.filter((_, i) => i !== index));

  const handleActionTypeChange = async (index: number, type: ActionType) => {
    updateAction(index, {
      type,
      config: {},
    });

    if (type === "assign-lead-to-user") {
      const users = await getTeams();
      setUsers(users);
    }
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">Actions</h2>
      <p className="text-xs text-gray-500 mb-4">
        Define what happens when this automation triggers
      </p>

      <div className="space-y-3">
        {actions?.map((action, index) => {
          const configFields = ACTION_CONFIG_FIELDS[action.type] || [];

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Action {index + 1}
                </span>
                <button
                  onClick={() => removeAction(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Action Type
                </label>
                <select
                  value={action.type}
                  onChange={(e) =>
                    handleActionTypeChange(index, e.target.value as ActionType)
                  }
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
                >
                  {ACTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {configFields.map((field) => {
                if (field.type === "users") {
                  return (
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        {field.label}
                      </label>

                      <Select
                        value={action.config[field.key] || ""}
                        onValueChange={(value) =>
                          updateActionConfig(index, field.key, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>

                        <SelectContent>
                          {users?.map((opt) => (
                            <SelectItem key={opt.key} value={opt.key}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                return (
                  <div key={field.key}>
                    <label className="text-xs text-gray-500 mb-1 block">
                      {field.label}
                    </label>
                    {field.options ? (
                      <select
                        value={action.config[field.key] || ""}
                        onChange={(e) =>
                          updateActionConfig(index, field.key, e.target.value)
                        }
                        className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={action.config[field.key] || ""}
                        onChange={(e) =>
                          updateActionConfig(index, field.key, e.target.value)
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-violet-400"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <Button
        onClick={addAction}
        className="mt-3 flex items-center gap-1.5 text-sm text-primary/90 font-medium hover:text-primary transition-colors cursor-pointer bg-transparent hover:bg-transparent"
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
        Add Another Action
      </Button>

      <div className="flex justify-between mt-6">
        <Button
          onClick={onBack}
          className="px-5 py-2 border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!actions.length}
          className="px-5 py-2 bg-primary/90 text-white text-sm font-medium rounded-lg hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChooseActionsStep;
