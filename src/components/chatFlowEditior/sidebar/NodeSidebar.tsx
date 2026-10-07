import { useMemo, useState } from "react";
import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Flag,
  GitBranch,
  Globe,
  Images,
  LayoutTemplate,
  List,
  MessageSquare,
  MousePointerClick,
  Phone,
  Tag,
  UserRound,
  Variable,
} from "lucide-react";
import { NODE_LIBRARY } from "../config";
import type { TNodeType } from "../types/types";

type NodeSidebarProps = {
  onAddNode: (type: TNodeType, label: string, preset?: string) => void;
  onClose: () => void;
};

const NODE_ICON_MAP: Record<string, any> = {
  send_message: MessageSquare,
  button: MousePointerClick,
  list: List,
  carousel: Images,
  template: LayoutTemplate,
  phone: Phone,
  keyword: MessageSquare,
  condition: GitBranch,
  set_attribute: Variable,
  add_tag: Tag,
  remove_tag: Tag,
  delay: Clock,
  goto: GitBranch,
  end: Flag,
  api_request: Globe,
  handoff: UserRound,
  connect_flow: GitBranch,
  question: MessageSquare,
};

type NodeSwatch = { bg: string; iconBg: string; iconColor: string };

const NODE_COLOR_BY_LABEL: Record<string, NodeSwatch> = {
  "Send Message": {
    bg: "bg-emerald-500/10",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  "Ask Question": {
    bg: "bg-violet-500/10",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-300",
  },
  "Text Buttons": {
    bg: "bg-orange-500/10",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
  },
  "Media Buttons": {
    bg: "bg-fuchsia-500/10",
    iconBg: "bg-fuchsia-500/20",
    iconColor: "text-fuchsia-300",
  },
  List: {
    bg: "bg-amber-500/10",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-300",
  },
  Template: {
    bg: "bg-teal-500/10",
    iconBg: "bg-teal-500/20",
    iconColor: "text-teal-300",
  },
  Carousel: {
    bg: "bg-blue-500/10",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-300",
  },
  "Request Intervention": {
    bg: "bg-rose-500/10",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-300",
  },
  Condition: {
    bg: "bg-purple-500/10",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-300",
  },
  Keyword: {
    bg: "bg-sky-500/10",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-300",
  },
  Delay: {
    bg: "bg-slate-500/10",
    iconBg: "bg-slate-500/20",
    iconColor: "text-slate-300",
  },
  "Go To": {
    bg: "bg-indigo-500/10",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-300",
  },
  "Connect Flow": {
    bg: "bg-pink-500/10",
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-300",
  },
  "End Flow": {
    bg: "bg-red-500/10",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-300",
  },
  "Set Attribute": {
    bg: "bg-yellow-500/10",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-300",
  },
  "Add Tag": {
    bg: "bg-lime-500/10",
    iconBg: "bg-lime-500/20",
    iconColor: "text-lime-300",
  },
  "Remove Tag": {
    bg: "bg-orange-600/10",
    iconBg: "bg-orange-600/20",
    iconColor: "text-orange-300",
  },
  "API Request": {
    bg: "bg-cyan-500/10",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-300",
  },
};

const FALLBACK_SWATCH: NodeSwatch = {
  bg: "bg-white/5",
  iconBg: "bg-white/10",
  iconColor: "text-gray-300",
};

const NodeSidebar = ({ onAddNode, onClose }: NodeSidebarProps) => {
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();

  const groups = useMemo(
    () =>
      NODE_LIBRARY.map((group) => ({
        ...group,
        nodes: group.nodes.filter((node) => {
          if (!term) return true;
          return `${node.label} ${node.keywords} ${group.category}`
            .toLowerCase()
            .includes(term);
        }),
      })).filter((group) => group.nodes.length),
    [term],
  );

  return (
    <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-100 flex-col bg-slate-900 text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">Node Library</h2>
          <p className="text-xs text-gray-400">Add blocks to your flow</p>
        </div>
        <ButtonClose onClose={onClose} />
      </div>

      <div className="border-b border-white/10 p-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="input-field border-none bg-white/5"
          placeholder="Search nodes..."
        />
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {groups.length ? (
          groups.map((group) => (
            <div key={group.category}>
              <p className="mb-2 text-[11px] font-medium tracking-wide text-gray-400 uppercase">
                {group.category}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {group.nodes.map((item) => {
                  const Icon = NODE_ICON_MAP[item.type] || MessageSquare;
                  const color = NODE_COLOR_BY_LABEL[item.label] || FALLBACK_SWATCH;
                  return (
                    <div
                      key={item.label}
                      onClick={() =>
                        onAddNode(
                          item.type as TNodeType,
                          item.label,
                          "preset" in item ? item.preset : undefined,
                        )
                      }
                      className={`group flex cursor-pointer flex-col items-center gap-3 rounded-2xl p-4 transition-all duration-200 ${color.bg} hover:bg-white/10`}
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${color.iconBg}`}
                      >
                        <Icon size={14} className={color.iconColor} />
                      </div>
                      <p className="text-center text-xs font-medium text-gray-200">
                        {item.label}
                      </p>
                      <span className="text-[10px] text-gray-500 opacity-0 transition group-hover:opacity-100">
                        Click to add
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="px-2 text-sm text-gray-400">No nodes match that search.</p>
        )}
      </div>
    </div>
  );
};

export default NodeSidebar;
