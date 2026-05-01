import { motion } from "framer-motion";
import { Handle, Position, useReactFlow } from "reactflow";
import { HelpCircle, Sparkles } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

import NodeHeader from "./NodeHeader";
import type { TAppNodeData, TQuestionNodeDataPayload } from "../types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TQuestionNodeProps = {
  id: string;
  data: TAppNodeData;
};

const SUGGESTIONS = [
  "What is your check-in date?",
  "Can you share your booking ID?",
  "What product are you looking for?",
  "Please enter your email address",
];

const INPUT_TYPES = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Number", value: "number" },
  { label: "Phone", value: "phone" },
  { label: "Date", value: "date" },
];

const MAX_TEXT_LENGTH = 1024;

export default function QuestionNode({ id, data }: TQuestionNodeProps) {
  const { setNodes } = useReactFlow();
  const payload = data?.type === "question" ? data.payload : null;

  const updatePayload = (updatedPayload: TQuestionNodeDataPayload) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                payload: updatedPayload,
              },
            }
          : node,
      ),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-90 bg-card shadow-lg"
    >
      {/* HEADER */}
      <NodeHeader
        title="Question"
        icon={<HelpCircle />}
        className="bg-violet-500"
      />

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles size={14} />
            Ask user for information
          </div>

          {/* INPUT TYPE */}
          <Select
            value={payload?.question.inputType}
            onValueChange={(value: "text" | "email" | "phone" | "date") =>
              updatePayload({
                ...payload,
                question: {
                  text: payload?.question.text ?? null,
                  inputType: value,
                },
              })
            }
          >
            <SelectTrigger className="h-8 w-auto bg-white border border-gray-200 text-xs text-gray-700 focus:ring-2 focus:ring-violet-300">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>

            <SelectContent>
              {INPUT_TYPES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* QUESTION INPUT */}
        <div className="space-y-2">
          <Textarea
            placeholder="Ask something..."
            value={payload?.question?.text || ""}
            onChange={(e) => {
              if (e.target.value.length > MAX_TEXT_LENGTH) return;
              updatePayload({
                ...payload,
                question: {
                  ...payload?.question,
                  text: e.target.value,
                },
              });
            }}
            className="max-h-90 input-field border-violet-300! focus:border-violet-400! nodrag"
          />

          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>Example: "Can you share your booking ID?"</span>

            <span>
              {payload?.question?.text?.length || 0}/{MAX_TEXT_LENGTH}
            </span>
          </div>
        </div>

        {/* QUICK SUGGESTIONS */}
        <div className="space-y-2">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            Suggestions
          </p>

          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled
                className="px-3 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HANDLES */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-slate-600! size-3!"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="bg-violet-500! size-3!"
      />
    </motion.div>
  );
}
