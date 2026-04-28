import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import {
  Flag,
  List,
  MessageSquare,
  MousePointerClick,
  Phone,
} from "lucide-react";
import { NODE_LIBRARY } from "../config";

type NodeSidebarProps = {
  onAddNode: (type: string, label: string) => void;
  onClose: () => void;
};

// 🎯 ICON MAP
const NODE_ICON_MAP: Record<string, any> = {
  send_message: MessageSquare,
  button: MousePointerClick,
  list: List,
  phone: Phone,
  end: Flag,
};

// 🎨 COLOR MAP (DARK BASED)
const NODE_COLOR_MAP: Record<
  string,
  { bg: string; iconBg: string; iconColor: string }
> = {
  send_message: {
    bg: "bg-emerald-500/10",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  button: {
    bg: "bg-indigo-500/10",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  list: {
    bg: "bg-orange-500/10",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
  },
  phone: {
    bg: "bg-sky-500/10",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-400",
  },
  end: {
    bg: "bg-rose-500/10",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
  },
};

const NodeSidebar = ({ onAddNode, onClose }: NodeSidebarProps) => {
  return (
    <div className="fixed right-0 top-0 max-w-100 w-full h-full bg-ternary text-white shadow-2xl z-50 flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-semibold">Node Library</h2>
          <p className="text-xs text-gray-400">Add blocks to your flow</p>
        </div>
        <ButtonClose onClose={onClose} />
      </div>

      {/* SEARCH */}
      <div className="p-4 border-b border-white/10">
        <Input
          className="bg-white/5 input-field border-none"
          placeholder="Search nodes..."
        />
      </div>

      {/* GRID */}
      <div className="overflow-y-auto p-4 grid grid-cols-2 gap-3">
        {NODE_LIBRARY.map((item, index) => {
          const Icon = NODE_ICON_MAP[item.type] || MessageSquare;
          const color =
            NODE_COLOR_MAP[item.type] || NODE_COLOR_MAP.send_message;

          return (
            <div
              key={index}
              onClick={() => onAddNode(item.type, item.label)}
              className={`
                group cursor-pointer rounded-xl p-4 flex flex-col items-center gap-3
                transition-all duration-200
                ${color.bg}
                hover:bg-white/10
              `}
            >
              {/* ICON */}
              <div
                className={`size-8 rounded-full flex items-center justify-center ${color.iconBg}`}
              >
                <Icon size={14} className={`${color.iconColor}`} />
              </div>

              {/* LABEL */}
              <p className="text-xs font-medium text-center text-gray-200">
                {item.label}
              </p>

              {/* hover hint */}
              <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition">
                Click to add
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeSidebar;
