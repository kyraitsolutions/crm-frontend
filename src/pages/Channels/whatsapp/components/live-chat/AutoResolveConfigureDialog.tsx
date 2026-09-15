import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FEATURE } from "@/constants/subscription.constant";
import { useSubscription } from "@/hooks/useSubscription";
import { Link } from "react-router-dom";
import type {
  AutoResolveConfig,
  AutoResolveMode,
  AutoResolveSchedule,
  LiveChatFlowOption,
} from "../../types/live-chat.type";

type Props = {
  open: boolean;
  saving?: boolean;
  value: AutoResolveConfig;
  flows: LiveChatFlowOption[];
  aiAgent: { configured: boolean; id: string | null; available: boolean };
  onClose: () => void;
  onSave: (value: AutoResolveConfig) => void;
};

const AutoResolveConfigureDialog = ({
  open,
  saving,
  value,
  flows,
  aiAgent,
  onClose,
  onSave,
}: Props) => {
  const { canAccessFeature } = useSubscription();
  const [draft, setDraft] = useState<AutoResolveConfig>(value);
  const publishedFlows = flows.filter((flow) => flow.isPublished);
  const aiAvailable = aiAgent.available || canAccessFeature(FEATURE.WHATSAPP_AI_AGENT);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const canEnable =
    (draft.mode === "flow" && Boolean(draft.chatFlowId)) ||
    (draft.mode === "ai_agent" && aiAvailable);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Configure auto resolve</DialogTitle>
          <DialogDescription>
            Choose a chatflow or AI agent, then pick when it should handle WhatsApp chats.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-3">
            <Label>Resolver</Label>
            <RadioGroup
              value={draft.mode || ""}
              onValueChange={(mode) =>
                setDraft((prev) => ({ ...prev, mode: mode as AutoResolveMode }))
              }
              className="grid gap-3"
            >
              <label className="flex items-start gap-3 rounded-xl border p-3">
                <RadioGroupItem value="flow" className="mt-1" />
                <div>
                  <p className="text-sm font-medium">Chatflow</p>
                  <p className="text-xs text-gray-500">
                    Use a published WhatsApp chatflow to auto-handle chats.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-xl border p-3">
                <RadioGroupItem value="ai_agent" className="mt-1" />
                <div>
                  <p className="text-sm font-medium">AI agent</p>
                  <p className="text-xs text-gray-500">
                    Available on upgraded plans. Uses the configured WhatsApp AI agent.
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {draft.mode === "flow" && (
            <div className="space-y-2">
              <Label>Published chatflow</Label>
              {publishedFlows.length ? (
                <Select
                  value={draft.chatFlowId || ""}
                  onValueChange={(chatFlowId) =>
                    setDraft((prev) => ({ ...prev, chatFlowId }))
                  }
                >
                  <SelectTrigger className="rounded-xl w-full">
                    <SelectValue placeholder="Select a chatflow" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {publishedFlows.map((flow) => (
                      <SelectItem key={flow.id} value={flow.id}>
                        {flow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-500">
                  No published chatflow yet.{" "}
                  <Link
                    className="text-teal-800 underline"
                    to="/dashboard/settings/chatflows"
                  >
                    Create a chatflow
                  </Link>{" "}
                  and publish it first.
                </p>
              )}
            </div>
          )}

          {draft.mode === "ai_agent" && (
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              {aiAvailable ? (
                <p>
                  WhatsApp AI agent is available on this plan
                  {aiAgent.id ? " and is already configured." : "."}
                </p>
              ) : (
                <p>
                  Upgrade your plan to enable the WhatsApp AI agent.{" "}
                  <Link
                    className="text-teal-800 underline"
                    to="/dashboard/settings/subscription"
                  >
                    View subscription
                  </Link>
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Label>When should it run?</Label>
            <RadioGroup
              value={draft.scheduleMode}
              onValueChange={(scheduleMode) =>
                setDraft((prev) => ({
                  ...prev,
                  scheduleMode: scheduleMode as AutoResolveSchedule,
                }))
              }
            >
              <label className="flex items-center gap-3 text-sm">
                <RadioGroupItem value="working_hours" />
                During working hours
              </label>
              <label className="flex items-center gap-3 text-sm">
                <RadioGroupItem value="off_hours" />
                Outside working hours
              </label>
              <label className="flex items-center gap-3 text-sm">
                <RadioGroupItem value="always" />
                Always
              </label>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-teal-900 hover:bg-teal-900/80"
            disabled={saving || !canEnable}
            onClick={() =>
              onSave({
                ...draft,
                enabled: true,
                aiAgentId: draft.mode === "ai_agent" ? aiAgent.id : draft.aiAgentId,
              })
            }
          >
            {saving ? "Saving..." : "Save and enable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoResolveConfigureDialog;
