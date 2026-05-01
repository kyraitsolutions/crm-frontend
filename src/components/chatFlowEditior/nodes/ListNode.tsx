import { motion } from "framer-motion";
import { Handle, Position } from "reactflow";
import { List, Type } from "lucide-react";
import NodeHeader from "./NodeHeader";
import type { TAppNodeData } from "../types/types";
import { Button } from "@/components/ui/button";

type TListNodeProps = {
  id: string;
  data: TAppNodeData;
};

const ListNode = ({ data }: TListNodeProps) => {
  const payload = data?.type === "list" ? data.payload : null;

  const headerText = payload?.interactive?.header?.text;
  const bodyText = payload?.interactive?.body?.text;
  const footerText = payload?.interactive?.footer?.text;

  const actionButton = payload?.interactive?.action?.button;
  const sections = payload?.interactive?.action?.sections || [];

  return (
    <motion.div
      className="w-90 bg-white rounded-xl shadow-lg border overflow-hidden"
      initial={false}
      animate={{ opacity: 1 }}
    >
      <NodeHeader title="List" className="bg-indigo-500" icon={<List />} />

      <div className="p-3 space-y-4 text-sm">
        {/* HEADER */}
        {headerText && (
          <div className="bg-gray-100 px-3 py-2 rounded-md text-xs font-semibold text-gray-700 flex items-center gap-2">
            <Type size={12} />
            <span>{headerText}</span>
          </div>
        )}

        {/* BODY */}
        <p className="text-gray-800 leading-relaxed ">{bodyText}</p>

        {/* FOOTER */}
        {footerText && (
          <p className="text-xs text-gray-400 text-center">{footerText}</p>
        )}

        {/* SECTIONS */}
        <div className="space-y-3">
          {sections.map((section, sIndex) => (
            <div key={sIndex} className="space-y-2">
              <p className="text-sm font-semibold text-indigo-500 tracking-wide">
                {section.title}
              </p>

              {section?.rows?.map((row) => (
                <div
                  key={row.id}
                  className="relative flex items-center bg-secondary/90 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition"
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium">{row.title}</p>
                    {row.description && (
                      <p className="text-xs text-gray-400">{row.description}</p>
                    )}
                  </div>

                  {/* HANDLE */}
                  <Handle
                    id={row.id}
                    type="source"
                    position={Position.Right}
                    className="bg-indigo-500! size-3! right-2!"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <Button className="actions-btn w-full">{actionButton}</Button>
      </div>

      {/* TARGET HANDLE */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-slate-600! size-3!"
      />
    </motion.div>
  );
};

export default ListNode;
