import { Handle, Position } from "reactflow";
import {
  Clock,
  Flag,
  GitBranch,
  Globe,
  Image,
  MapPin,
  MessageSquare,
  Tag,
  UserRound,
  Variable,
} from "lucide-react";
import type { TAppNodeData, TFlowActionType } from "../types/types";
import NodeHeader from "./NodeHeader";

const META: Record<
  TFlowActionType,
  { title: string; color: string; icon: typeof GitBranch }
> = {
  keyword: { title: "Keyword", color: "bg-sky-600", icon: MessageSquare },
  condition: { title: "If / Else", color: "bg-violet-600", icon: GitBranch },
  set_attribute: { title: "Set Attribute", color: "bg-amber-600", icon: Variable },
  add_tag: { title: "Add Tag", color: "bg-emerald-600", icon: Tag },
  remove_tag: { title: "Remove Tag", color: "bg-orange-600", icon: Tag },
  delay: { title: "Delay", color: "bg-slate-600", icon: Clock },
  goto: { title: "Go To", color: "bg-indigo-600", icon: GitBranch },
  end: { title: "End Flow", color: "bg-rose-600", icon: Flag },
  api_request: { title: "API Request", color: "bg-cyan-700", icon: Globe },
  handoff: { title: "Request Intervention", color: "bg-rose-700", icon: UserRound },
  ask_address: { title: "Ask Address", color: "bg-emerald-700", icon: MapPin },
  ask_location: { title: "Ask Location", color: "bg-sky-700", icon: MapPin },
  ask_media: { title: "Ask Media", color: "bg-indigo-700", icon: Image },
  connect_flow: { title: "Connect Flow", color: "bg-violet-700", icon: GitBranch },
};

function summary(data: TAppNodeData) {
  if (!("payload" in data) || data.type === "send_message") return "";
  const payload = data.payload as { type?: string; [key: string]: any };
  switch (data.type) {
    case "keyword":
      return payload.keyword?.words || "Match customer words";
    case "condition":
      return `${payload.condition?.rules?.length || 0} rule(s), ${payload.condition?.match === "any" ? "any" : "all"}`;
    case "set_attribute":
      return payload.attribute?.key
        ? `${payload.attribute.key} (${payload.attribute.scope || "flow"})`
        : "Choose an attribute";
    case "add_tag":
    case "remove_tag":
      return payload.tag?.name || "Choose a tag";
    case "delay": {
      const amount = payload.delay?.amount ?? payload.delay?.seconds ?? 0;
      const unit = payload.delay?.unit || "seconds";
      return `${amount} ${unit}`;
    }
    case "goto":
      return payload.goto?.targetNodeId ? "Jump configured" : "Choose a node";
    case "api_request":
      return payload.request?.url || "Configure the request";
    case "handoff":
      return "Pause automation for a teammate";
    case "ask_address":
    case "ask_location":
    case "ask_media":
      return payload.ask?.text || "Waiting for the customer";
    case "connect_flow":
      return payload.connect?.name || "Choose a flow";
    case "end":
      return "Stop this flow";
    default:
      return "";
  }
}

export default function FlowActionNode({ data }: { id: string; data: TAppNodeData }) {
  const type = data.type as TFlowActionType;
  const meta = META[type] || META.condition;
  const Icon = meta.icon;
  const branched = type === "condition" || type === "api_request" || type === "keyword";

  return (
    <div className="w-72 overflow-hidden rounded-xl! bg-card shadow-lg">
      <NodeHeader title={meta.title} icon={<Icon size={16} />} className={meta.color} />
      <div className="px-4 py-3 text-xs text-muted-foreground">{summary(data)}</div>
      <Handle type="target" position={Position.Left} className="size-3! bg-slate-600!" />
      {branched ? (
        <>
          <Handle
            id={type === "api_request" ? "success" : type === "keyword" ? "matched" : "true"}
            type="source"
            position={Position.Right}
            style={{ top: "38%" }}
            className="size-3! bg-emerald-500!"
          />
          <Handle
            id={type === "api_request" ? "failure" : type === "keyword" ? "unmatched" : "false"}
            type="source"
            position={Position.Right}
            style={{ top: "72%" }}
            className="size-3! bg-rose-500!"
          />
        </>
      ) : type === "end" ? null : (
        <Handle type="source" position={Position.Right} className="size-3! bg-slate-600!" />
      )}
    </div>
  );
}
