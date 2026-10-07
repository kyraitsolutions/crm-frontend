import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamsStore } from "@/stores/team.store";
import React, { useEffect, useMemo, useState } from "react";
import { actionsForTrigger } from "../../constants/automation.constants";
import type {
  ActionType,
  AutomationAction,
  TriggerType,
} from "../../store/automation.store";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConfigurationStore } from "../../store/configuration.store";

interface ChooseActionsStepProps {
  trigger: TriggerType | null;
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
  }[]
> = {
  assign_lead_to_user: [{ label: "Assign To", key: "user", type: "users" }],
  update_lead_stage: [
    { label: "Move To Stage", key: "stage", type: "lead_stages" },
  ],
  add_lead_tag: [
    {
      label: "Tag",
      key: "tag",
      type: "text",
      placeholder: "e.g. hot-lead",
    },
  ],
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
    {
      label: "Notify",
      key: "target",
      type: "select",
      options: [
        { label: "Account inbox", value: "account" },
        { label: "Lead owner", value: "lead_owner" },
      ],
    },
  ],
};

const ChooseActionsStep: React.FC<ChooseActionsStepProps> = ({
  trigger,
  actions,
  onChange,
  onBack,
  onNext,
}) => {
  const { getTeams } = useTeamsStore();
  const { getConfigurationByType } = useConfigurationStore();
  const availableActions = useMemo(() => actionsForTrigger(trigger), [trigger]);
  const defaultType = availableActions[0]?.value || "create_task";

  const addAction = () =>
    onChange([...actions, { type: defaultType, config: {} }]);

  const [users, setUsers] = useState<{ label: string; key: string }[]>([]);
  const [stages, setStages] = useState<{ label: string; key: string }[]>([]);

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

  const loadUsers = async () => {
    if (users.length) return;
    const team = await getTeams();
    setUsers(
      (team || []).map((u: any) => ({
        label:
          `${u.userProfile?.firstName || ""} ${u.userProfile?.lastName || ""}`.trim() ||
          u.email ||
          "User",
        key: String(u.userId || u.id),
      })),
    );
  };

  const loadStages = async () => {
    if (stages.length) return;
    const values = await getConfigurationByType("lead-status");
    const list = Array.isArray(values) ? values : [];
    setStages(
      list.map((item: any) => ({
        key: String(item.key || item),
        label: String(item.label || item.key || item),
      })),
    );
  };

  const handleActionTypeChange = async (index: number, type: ActionType) => {
    updateAction(index, {
      type,
      config: {},
    });
    if (
      type === "assign_lead_to_user" ||
      type === "create_task" ||
      type === "send_notification"
    ) {
      await loadUsers();
    }
    if (type === "update_lead_stage") {
      await loadStages();
    }
  };

  useEffect(() => {
    void (async () => {
      await loadUsers();
      await loadStages();
      const allowed = new Set(availableActions.map((a) => a.value));
      const cleaned = actions.filter((a) => allowed.has(a.type));
      if (!cleaned.length) {
        onChange([{ type: defaultType, config: {} }]);
      } else if (cleaned.length !== actions.length) {
        onChange(cleaned);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

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

      case "lead_stages":
        return (
          <Select
            value={action.config[field.key] || ""}
            onValueChange={(value) =>
              updateActionConfig(index, field.key, value)
            }
          >
            <SelectTrigger className="w-full input-field">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.key} value={stage.key}>
                  {stage.label}
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
                    {availableActions.map((opt) => (
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
          className="px-5 py-2 border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium rounded-2xl hover:bg-gray-50 transition-colors"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={
            !actions.length ||
            actions.some((a) => {
              if (a.type === "assign_lead_to_user") return !a.config.user;
              if (a.type === "update_lead_stage") return !a.config.stage;
              if (a.type === "add_lead_tag") return !a.config.tag?.trim();
              if (a.type === "create_task") return !a.config.title?.trim();
              if (a.type === "send_notification") return !a.config.target;
              return false;
            })
          }
          className="px-5 py-2 bg-primary/90 text-white text-sm font-medium rounded-2xl hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChooseActionsStep;
