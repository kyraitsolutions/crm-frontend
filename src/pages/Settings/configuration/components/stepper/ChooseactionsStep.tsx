import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamsStore } from "@/stores/team.store";
import React, { useEffect, useState } from "react";
import { ACTION_OPTIONS } from "../../constants/automation.constants";
import type {
  ActionType,
  AutomationAction,
} from "../../store/automation.store";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    placeholder?: string;
    options?: string[] | { label: string; value: string }[];
    type?: string;
    types?: string;
  }[]
> = {
  assign_lead_to_user: [{ label: "Assign To", key: "user", type: "users" }],
  create_task: [
    {
      label: "Task Title",
      key: "title",
      type: "text",
      placeholder: "Follow up with lead",
    },
    {
      label: "Description",
      key: "description",
      type: "textarea",
      placeholder: "Add task instructions",
    },
    {
      label: "Priority",
      key: "priority",
      type: "select",
      options: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ],
    },
    {
      label: "Due In",
      key: "dueType",
      type: "select",
      options: [
        { label: "1 Day", value: "1" },
        { label: "3 Days", value: "3" },
        { label: "7 Days", value: "7" },
        { label: "14 Days", value: "14" },
        { label: "Custom Date", value: "custom" },
      ],
    },
    {
      label: "Assign To",
      key: "assignedTo",
      type: "users",
    },
  ],
  send_notification: [
    // { label: "Automation Name", key: "name" },
    {
      label: "Notify",
      key: "target",
      options: ["Sales Manager", "Lead Owner", "All Team"],
    },
  ],
};

const emptyAction = (): AutomationAction => ({
  type: "assign_lead_to_user",
  config: {},
});

const ChooseActionsStep: React.FC<ChooseActionsStepProps> = ({
  actions,
  onChange,
  onBack,
  onNext,
}) => {
  const { getTeams } = useTeamsStore();
  const addAction = () => onChange([...actions, emptyAction()]);

  const [users, setUsers] = useState<{ label: string; key: string }[]>([]);

  const handleDueDateChange = (index: number, value: string) => {
    if (value === "custom") {
      updateActionConfig(index, "dueType", value);
      return;
    }

    const days = Number(value);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    updateAction(index, {
      config: {
        ...actions[index].config,
        dueType: value,
        dueDate: dueDate.toISOString(),
      },
    });
  };

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

    if (type === "assign_lead_to_user") {
      const users = await getTeams();
      setUsers(
        users.map((u) => ({ label: u.userProfile.firstName, key: u.id })),
      );
    }
  };

  const initializeActionTypeValue = () => {
    handleActionTypeChange(0, "assign_lead_to_user");
  };

  useEffect(() => {
    initializeActionTypeValue();
  }, []);

  const renderField = (field: any, action: AutomationAction, index: number) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            className="w-full input-field"
            value={action.config[field.key] || ""}
            placeholder={field.placeholder}
            onChange={(e) =>
              updateActionConfig(index, field.key, e.target.value)
            }
          />
        );

      case "textarea":
        return (
          <Textarea
            className="w-full input-field"
            value={action.config[field.key] || ""}
            placeholder={field.placeholder}
            onChange={(e) =>
              updateActionConfig(index, field.key, e.target.value)
            }
          />
        );

      case "users":
        return (
          <Select
            value={action.config[field.key] || ""}
            onValueChange={(value) =>
              updateActionConfig(index, field.key, value)
            }
          >
            <SelectTrigger className="w-full input-field">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>

            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.key} value={user.key}>
                  {user.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "select":
        return (
          <Select
            value={action.config[field.key] || ""}
            onValueChange={(value) => {
              if (field.key === "dueType") {
                handleDueDateChange(index, value);
                return;
              }

              updateActionConfig(index, field.key, value);
            }}
          >
            <SelectTrigger className="w-full input-field">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>

            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
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
                <Select
                  value={action.type}
                  onValueChange={(value) =>
                    handleActionTypeChange(index, value as ActionType)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>

                  <SelectContent>
                    {ACTION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {configFields.map((field) => {
                return (
                  <div key={field.key}>
                    <label className="text-xs text-gray-500 mb-1 block">
                      {field.label}
                    </label>

                    <div className="w-full">
                      {renderField(field, action, index)}
                    </div>

                    {field.key === "dueType" &&
                      action.config.dueType === "custom" && (
                        <div className="mt-3 space-y-2">
                          <Label>Custom Due Date</Label>

                          <Input
                            type="date"
                            value={action.config.dueDate || ""}
                            onChange={(e) =>
                              updateActionConfig(
                                index,
                                "dueDate",
                                e.target.value,
                              )
                            }
                          />
                        </div>
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
        className="flex items-center gap-1.5 text-sm text-primary/90 font-medium hover:text-primary transition-colors cursor-pointer bg-transparent hover:bg-transparent underline"
      >
        <Plus />
        Add {actions.length > 0 ? "another" : ""} Action
      </Button>

      <div className="flex justify-between mt-6">
        <Button
          onClick={onBack}
          className="px-5 py-2 border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!actions.length}
          className="px-5 py-2 bg-primary/90 text-white text-sm font-medium rounded-xl hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChooseActionsStep;
