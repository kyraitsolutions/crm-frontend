import { motion } from "framer-motion";
import { LayoutTemplate } from "lucide-react";
import { Handle, Position } from "reactflow";
import type { TAppNodeData } from "../types/types";
import NodeHeader from "./NodeHeader";

type TTemplateNodeProps = {
  id: string;
  data: TAppNodeData;
};

export default function TemplateNode({ data }: TTemplateNodeProps) {
  const template = data?.type === "template" ? data.payload.template : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-90 bg-card shadow-lg rounded-xl! overflow-hidden"
    >
      <NodeHeader
        title="Template"
        icon={<LayoutTemplate size={16} />}
        className="bg-teal-600"
      />

      <div className="p-4 space-y-3">
        {template ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground break-all">
                {template.name}
              </p>
              <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">
                {template.language}
              </span>
            </div>
            {template.category ? (
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {template.category}
              </p>
            ) : null}
            <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
              {template.preview || "Approved WhatsApp template"}
            </p>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-teal-200 bg-teal-50/60 px-3 py-4 text-center">
            <p className="text-sm font-medium text-teal-900">
              No template selected
            </p>
            <p className="mt-1 text-xs text-teal-700/80">
              Open this node and choose an approved template
            </p>
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="bg-slate-600! size-3!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="bg-teal-600! size-3!"
      />
    </motion.div>
  );
}
