import { useEffect, useState, type ReactNode } from "react";
import { useReactFlow } from "reactflow";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chatflowService } from "@/pages/ChatFlows/services/chatflow.service";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type {
  TAppNodeData,
  TConditionRule,
  TFlowActionPayload,
  TFlowActionType,
} from "../types/types";

type Props = {
  id?: string;
  data: TAppNodeData;
  onClose?: () => void;
};

const OPERATORS: Array<{ value: TConditionRule["operator"]; label: string }> = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not equals" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
  { value: "gt", label: "Greater than" },
  { value: "gte", label: "Greater than or equal" },
  { value: "lt", label: "Less than" },
  { value: "lte", label: "Less than or equal" },
  { value: "empty", label: "Is empty" },
  { value: "not_empty", label: "Is not empty" },
];

const TITLES: Record<TFlowActionType, { title: string; description: string }> = {
  keyword: { title: "Keyword", description: "Match this contact's latest message" },
  condition: { title: "Condition", description: "Branch from a saved value or the latest reply" },
  set_attribute: { title: "Set Attribute", description: "Save a value for later nodes" },
  add_tag: { title: "Add Tag", description: "Add a tag on the current contact" },
  remove_tag: { title: "Remove Tag", description: "Remove a tag from the current contact" },
  delay: { title: "Delay", description: "Wait, then continue this flow" },
  goto: { title: "Go To", description: "Jump to another node in this flow" },
  end: { title: "End Flow", description: "Stop this flow only" },
  api_request: { title: "API Request", description: "Call an HTTPS API and save the response" },
  handoff: { title: "Request Intervention", description: "Pause automation so a teammate can reply" },
  ask_address: { title: "Ask Address", description: "Ask for an address and save the reply" },
  ask_location: { title: "Ask Location", description: "Ask the customer to share their WhatsApp location" },
  ask_media: { title: "Ask Media", description: "Ask the customer to send a photo, video, or document" },
  connect_flow: { title: "Connect Flow", description: "Continue in another published flow" },
};

const fieldClass = "input-field w-full border-white/15! bg-white/5 text-white";

const FlowActionNodeSetting = ({ id, data, onClose }: Props) => {
  const { setNodes, getNodes } = useReactFlow();
  const toast = new ToastMessageService();
  const type = (data.type || "condition") as TFlowActionType;
  const saved = (data.type === type ? data.payload : { type }) as TFlowActionPayload;
  const [draft, setDraft] = useState<TFlowActionPayload>(saved);
  const [flows, setFlows] = useState<Array<{ id: string; name: string }>>([]);
  const accountId = useAuthStore((state) => state.accountId);
  const copy = TITLES[type] || TITLES.condition;

  useEffect(() => {
    if (type !== "connect_flow" || !accountId) return;
    let active = true;
    chatflowService
      .getAllChatFlow(accountId)
      .then((response) => {
        if (!active) return;
        const docs = (response.data?.docs || []) as Array<{ id: string; name: string }>;
        setFlows(docs.filter((flow) => flow.id && flow.id !== id));
      })
      .catch(() => {
        if (active) setFlows([]);
      });
    return () => {
      active = false;
    };
  }, [accountId, id, type]);

  const save = () => {
    if (type === "keyword" && !draft.keyword?.words.trim()) {
      toast.error("Enter at least one keyword");
      return;
    }
    if (type === "set_attribute" && !draft.attribute?.key.trim()) {
      toast.error("Enter an attribute name");
      return;
    }
    if ((type === "add_tag" || type === "remove_tag") && !draft.tag?.name.trim()) {
      toast.error("Enter a tag");
      return;
    }
    if (type === "goto" && !draft.goto?.targetNodeId) {
      toast.error("Choose the node to jump to");
      return;
    }
    if (type === "api_request" && !draft.request?.url.trim()) {
      toast.error("Enter an API URL");
      return;
    }
    if (type === "condition" && !draft.condition?.rules.length) {
      toast.error("Add at least one condition");
      return;
    }
    if (
      (type === "ask_address" || type === "ask_location" || type === "ask_media") &&
      !draft.ask?.text.trim()
    ) {
      toast.error("Enter the question to send");
      return;
    }
    if (type === "connect_flow" && !draft.connect?.chatFlowId) {
      toast.error("Choose a flow to connect");
      return;
    }

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, type, payload: draft } }
          : node,
      ),
    );
    onClose?.();
  };

  const otherNodes = getNodes().filter((node) => node.id !== id);

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">{copy.title}</h2>
          <p className="text-xs text-gray-400">{copy.description}</p>
        </div>
        <ButtonClose onClose={() => onClose?.()} />
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
        {type === "keyword" ? (
          <>
            <Field label="Keywords or phrases">
              <Input
                className={fieldClass}
                placeholder="hi, hello, start"
                value={draft.keyword?.words || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    keyword: {
                      words: event.target.value,
                      match: draft.keyword?.match || "contains",
                      caseSensitive: Boolean(draft.keyword?.caseSensitive),
                    },
                  })
                }
              />
            </Field>
            <Field label="Match">
              <Select
                value={draft.keyword?.match || "contains"}
                onValueChange={(match: "exact" | "contains" | "phrase") =>
                  setDraft({
                    ...draft,
                    keyword: {
                      words: draft.keyword?.words || "",
                      match,
                      caseSensitive: Boolean(draft.keyword?.caseSensitive),
                    },
                  })
                }
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="exact">Exact message</SelectItem>
                  <SelectItem value="phrase">Whole phrase</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={Boolean(draft.keyword?.caseSensitive)}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    keyword: {
                      words: draft.keyword?.words || "",
                      match: draft.keyword?.match || "contains",
                      caseSensitive: event.target.checked,
                    },
                  })
                }
              />
              Case sensitive
            </label>
            <p className="text-[11px] text-gray-500">
              This checks only the latest message in this conversation. Green continues when it matches. Red is the unmatched path.
            </p>
          </>
        ) : null}

        {type === "condition" ? (
          <div className="space-y-3">
            <Field label="Match">
              <Select
                value={draft.condition?.match || "all"}
                onValueChange={(match: "all" | "any") =>
                  setDraft({
                    ...draft,
                    condition: { match, rules: draft.condition?.rules || [] },
                  })
                }
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All rules</SelectItem>
                  <SelectItem value="any">Any rule</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {(draft.condition?.rules || []).map((rule, index) => {
              const rules = draft.condition?.rules || [];
              const canRemove = rules.length > 1;
              return (
                <div key={index} className="space-y-2 rounded-xl bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400">Rule {index + 1}</span>
                    {canRemove ? (
                      <button
                        type="button"
                        aria-label={`Remove rule ${index + 1}`}
                        title="Remove rule"
                        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-red-300 hover:bg-white/10 hover:text-red-200"
                        onClick={() => removeRule(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : null}
                  </div>
                  <Input
                    className={fieldClass}
                    placeholder="{{reply}} or {{name}}"
                    value={rule.left}
                    onChange={(event) => updateRule(index, { left: event.target.value })}
                  />
                  <Select
                    value={rule.operator}
                    onValueChange={(operator: TConditionRule["operator"]) =>
                      updateRule(index, { operator })
                    }
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {rule.operator !== "empty" && rule.operator !== "not_empty" ? (
                    <Input
                      className={fieldClass}
                      placeholder="Value"
                      value={rule.right}
                      onChange={(event) => updateRule(index, { right: event.target.value })}
                    />
                  ) : null}
                </div>
              );
            })}

            <Button
              type="button"
              className=" cursor-pointer rounded-xl!"
              onClick={() =>
                setDraft({
                  ...draft,
                  condition: {
                    match: draft.condition?.match || "all",
                    rules: [
                      ...(draft.condition?.rules || []),
                      { left: "{{reply}}", operator: "contains", right: "" },
                    ],
                  },
                })
              }
            >
              Add rule
            </Button>

            <p className="text-[11px] text-gray-500">
              Use {"{{reply}}"} for the latest message and {"{{name}}"} for a saved attribute. An empty or invalid number does not pass a comparison. Green is true, red is false.
            </p>
          </div>
        ) : null}

        {type === "set_attribute" ? (
          <>
            <Field label="Save on">
              <Select
                value={draft.attribute?.scope || "flow"}
                onValueChange={(scope: "flow" | "contact" | "conversation") =>
                  setDraft({
                    ...draft,
                    attribute: {
                      key: draft.attribute?.key || "",
                      value: draft.attribute?.value || "{{reply}}",
                      scope,
                      dataType: draft.attribute?.dataType || "text",
                    },
                  })
                }
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flow">This flow</SelectItem>
                  <SelectItem value="conversation">This conversation</SelectItem>
                  <SelectItem value="contact">This contact</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Attribute name">
              <Input
                className={fieldClass}
                placeholder="name"
                value={draft.attribute?.key || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    attribute: {
                      key: event.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
                      value: draft.attribute?.value || "",
                      scope: draft.attribute?.scope || "flow",
                      dataType: draft.attribute?.dataType || "text",
                    },
                  })
                }
              />
            </Field>
            <Field label="Data type">
              <Select
                value={draft.attribute?.dataType || "text"}
                onValueChange={(dataType: "text" | "number") =>
                  setDraft({
                    ...draft,
                    attribute: {
                      key: draft.attribute?.key || "",
                      value: draft.attribute?.value || "",
                      scope: draft.attribute?.scope || "flow",
                      dataType,
                    },
                  })
                }
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Value">
              <Input
                className={fieldClass}
                placeholder="{{reply}}"
                value={draft.attribute?.value || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    attribute: {
                      key: draft.attribute?.key || "",
                      value: event.target.value,
                      scope: draft.attribute?.scope || "flow",
                      dataType: draft.attribute?.dataType || "text",
                    },
                  })
                }
              />
            </Field>
            <p className="text-[11px] text-gray-500">
              {"{{reply}}"} is the latest message, {"{{phone}}"} is the phone number, and {"{{name}}"} is a value saved earlier. A blank value does not overwrite an existing attribute. Contact name and email update those contact fields. Other contact values are stored on the contact without changing unrelated fields.
            </p>
          </>
        ) : null}

        {type === "add_tag" || type === "remove_tag" ? (
          <Field label="Tag">
            <Input
              className={fieldClass}
              placeholder="vip"
              value={draft.tag?.name || ""}
              onChange={(event) => setDraft({ ...draft, tag: { name: event.target.value } })}
            />
            <p className="text-[11px] text-gray-500">
              {type === "add_tag"
                ? "Adds this tag on the current contact. Typing a new name creates it. Adding it again does nothing."
                : "Removes this tag from the current contact. If the contact or tag is already missing, the flow continues."}
            </p>
          </Field>
        ) : null}

        {type === "delay" ? (
          <Field label="Wait">
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                className={fieldClass}
                value={draft.delay?.amount ?? draft.delay?.seconds ?? 5}
                onChange={(event) => {
                  const unit = draft.delay?.unit || "seconds";
                  const caps = { seconds: 300, minutes: 1440, hours: 72, days: 30 };
                  const amount = Math.min(
                    caps[unit],
                    Math.max(1, Number(event.target.value) || 1),
                  );
                  setDraft({
                    ...draft,
                    delay: { unit, amount, seconds: unit === "seconds" ? amount : draft.delay?.seconds || amount },
                  });
                }}
              />
              <Select
                value={draft.delay?.unit || "seconds"}
                onValueChange={(unit: "seconds" | "minutes" | "hours" | "days") => {
                  const caps = { seconds: 300, minutes: 1440, hours: 72, days: 30 };
                  const amount = Math.min(caps[unit], Math.max(1, Number(draft.delay?.amount ?? draft.delay?.seconds ?? 5)));
                  setDraft({
                    ...draft,
                    delay: {
                      unit,
                      amount,
                      seconds: unit === "seconds" ? amount : draft.delay?.seconds || amount,
                    },
                  });
                }}
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[11px] text-gray-500">
              The wait is scheduled and the flow continues later. Limits are 300 seconds, 1,440 minutes, 72 hours, or 30 days. A paused conversation, opt-out, or cancelled flow is not resumed.
            </p>
          </Field>
        ) : null}

        {type === "goto" ? (
          <Field label="Jump to">
            <Select
              value={draft.goto?.targetNodeId || undefined}
              onValueChange={(targetNodeId) =>
                setDraft({ ...draft, goto: { targetNodeId } })
              }
            >
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select a node" />
              </SelectTrigger>
              <SelectContent>
                {otherNodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {String(node.data?.label || node.data?.type || node.type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-gray-500">
              The flow jumps to that node and stops after 8 jumps, including a loop back to the same node.
            </p>
          </Field>
        ) : null}

        {type === "api_request" ? (
          <>
            <Field label="Method">
              <Select
                value={draft.request?.method || "GET"}
                onValueChange={(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE") =>
                  setDraft({
                    ...draft,
                    request: { ...(draft.request as TFlowActionPayload["request"])!, method },
                  })
                }
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="HTTPS URL">
              <Input
                className={fieldClass}
                placeholder="https://api.example.com/orders/{{reply}}"
                value={draft.request?.url || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    request: { ...(draft.request as TFlowActionPayload["request"])!, url: event.target.value },
                  })
                }
              />
            </Field>
            <Field label="Query parameters">
              <PairList
                rows={draft.request?.query || []}
                onChange={(query) =>
                  setDraft({
                    ...draft,
                    request: { ...(draft.request as TFlowActionPayload["request"])!, query },
                  })
                }
              />
            </Field>
            <Field label="Headers">
              <PairList
                rows={draft.request?.headers || []}
                onChange={(headers) =>
                  setDraft({
                    ...draft,
                    request: { ...(draft.request as TFlowActionPayload["request"])!, headers },
                  })
                }
              />
              <p className="text-[11px] text-gray-500">
                Header values are saved with this flow. Do not put long-lived secrets here.
              </p>
            </Field>
            <Field label="JSON body">
              <Textarea
                className={`${fieldClass} min-h-24`}
                placeholder='{"phone":"{{phone}}"}'
                value={draft.request?.body || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    request: { ...(draft.request as TFlowActionPayload["request"])!, body: event.target.value },
                  })
                }
              />
            </Field>
            <Field label="Save response as">
              <Input
                className={fieldClass}
                value={draft.request?.saveAs || "api"}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    request: {
                      ...(draft.request as TFlowActionPayload["request"])!,
                      saveAs: event.target.value.replace(/[^a-zA-Z0-9_]/g, "") || "api",
                    },
                  })
                }
              />
            </Field>
            <p className="text-[11px] text-gray-500">
              Only HTTPS is allowed. Private networks and redirects are blocked. Green continues on success. Red continues when the request fails. Later nodes can read {"{{api.status}}"}.
            </p>
          </>
        ) : null}

        {type === "handoff" ? (
          <>
            <Field label="Reason">
              <Input
                className={fieldClass}
                placeholder="Customer asked for a person"
                value={draft.handoff?.reason || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    handoff: { ...(draft.handoff || { note: "" }), reason: event.target.value },
                  })
                }
              />
            </Field>
            <Field label="Priority">
              <Select
                value={draft.handoff?.priority || "normal"}
                onValueChange={(priority: "low" | "normal" | "high") =>
                  setDraft({
                    ...draft,
                    handoff: { ...(draft.handoff || { note: "" }), priority },
                  })
                }
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Message to the customer">
              <Textarea
                className={`${fieldClass} min-h-20`}
                placeholder="A teammate will reply shortly."
                value={draft.handoff?.customerMessage || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    handoff: {
                      ...(draft.handoff || { note: "" }),
                      customerMessage: event.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Note for the teammate">
              <Textarea
                className={`${fieldClass} min-h-24`}
                value={draft.handoff?.note || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    handoff: { ...(draft.handoff || { note: "" }), note: event.target.value },
                  })
                }
              />
            </Field>
            <p className="text-[11px] text-gray-500">
              This pauses automated replies for this conversation. Assigning a specific teammate is not available on the conversation yet.
            </p>
          </>
        ) : null}

        {type === "ask_address" || type === "ask_location" || type === "ask_media" ? (
          <Field label="Message">
            <Textarea
              className={`${fieldClass} min-h-24`}
              value={draft.ask?.text || ""}
              onChange={(event) => setDraft({ ...draft, ask: { text: event.target.value } })}
            />
            <p className="text-[11px] text-gray-500">
              The flow waits for the customer, then saves the reply as{" "}
              {type === "ask_address" ? "{{address}}" : type === "ask_location" ? "{{location}}" : "{{media}}"}.
            </p>
          </Field>
        ) : null}

        {type === "connect_flow" ? (
          <Field label="Published flow">
            <Select
              value={draft.connect?.chatFlowId || undefined}
              onValueChange={(chatFlowId) => {
                const flow = flows.find((item) => item.id === chatFlowId);
                setDraft({ ...draft, connect: { chatFlowId, name: flow?.name } });
              }}
            >
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Select a flow" />
              </SelectTrigger>
              <SelectContent>
                {flows.map((flow) => (
                  <SelectItem key={flow.id} value={flow.id}>
                    {flow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-gray-500">
              Continues from the first node of that published flow and does not return here. Connecting back to a flow already in this run stops the flow.
            </p>
          </Field>
        ) : null}

        {type === "end" ? (
          <p className="text-sm text-gray-400">
            This stops the current flow only. The contact and the conversation stay as they are.
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-white/10 bg-[#0f172a] p-3">
        <Button className="node-setting-footer-btns" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button className="node-setting-footer-btns node-setting-footer-btns-save" onClick={save}>
          Save
        </Button>
      </div>
    </div>
  );

  function updateRule(index: number, patch: Partial<TConditionRule>) {
    const rules = [...(draft.condition?.rules || [])];
    rules[index] = { ...rules[index], ...patch };
    setDraft({
      ...draft,
      condition: { match: draft.condition?.match || "all", rules },
    });
  }

  function removeRule(index: number) {
    const rules = draft.condition?.rules || [];
    if (rules.length <= 1) return;
    setDraft({
      ...draft,
      condition: {
        match: draft.condition?.match || "all",
        rules: rules.filter((_, ruleIndex) => ruleIndex !== index),
      },
    });
  }
};

function PairList({
  rows,
  onChange,
}: {
  rows: Array<{ key: string; value: string }>;
  onChange: (rows: Array<{ key: string; value: string }>) => void;
}) {
  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex gap-2">
          <Input
            className={fieldClass}
            placeholder="Name"
            value={row.key}
            onChange={(event) => {
              const next = [...rows];
              next[index] = { ...row, key: event.target.value };
              onChange(next);
            }}
          />
          <Input
            className={fieldClass}
            placeholder="Value"
            value={row.value}
            onChange={(event) => {
              const next = [...rows];
              next[index] = { ...row, value: event.target.value };
              onChange(next);
            }}
          />
        </div>
      ))}
      <Button
        type="button"
        className="bg-white/10"
        onClick={() => onChange([...(rows || []), { key: "", value: "" }])}
      >
        Add
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      {children}
    </div>
  );
}

export default FlowActionNodeSetting;
