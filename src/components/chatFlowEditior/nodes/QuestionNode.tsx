import { motion } from "framer-motion";
import { Handle, Position, useReactFlow } from "reactflow";
import { HelpCircle, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import NodeHeader from "./NodeHeader";
import type { TAppNodeData, TQuestionInputType, TQuestionNodeDataPayload } from "../types/types";
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

const INPUT_TYPES: Array<{ label: string; value: TQuestionInputType }> = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Date & Time", value: "datetime" },
  { label: "Date Range", value: "date-range" },
  { label: "Buttons", value: "buttons" },
  { label: "Location", value: "location" },
  { label: "Address", value: "address" },
  { label: "Media", value: "media" },
];

const MAX_TEXT_LENGTH = 1024;

export default function QuestionNode({ id, data }: TQuestionNodeProps) {
  const { setNodes } = useReactFlow();
  const payload = data?.type === "question" ? data.payload : null;

  const question = payload?.question;
  const patchQuestion = (patch: Partial<TQuestionNodeDataPayload["question"]>) => {
    updatePayload({
      type: "question",
      legacyAsk: payload?.legacyAsk,
      question: {
        text: question?.text ?? "",
        inputType: question?.inputType ?? "text",
        required: question?.required !== false,
        attribute: question?.attribute || "",
        retryMessage: question?.retryMessage || "",
        maxAttempts: question?.maxAttempts || 2,
        options: question?.options || [],
        ...patch,
      },
    });
  };

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
      className="w-90 bg-card shadow-lg rounded-xl! overflow-hidden"
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
            value={question?.inputType || "text"}
            onValueChange={(value: TQuestionInputType) => patchQuestion({ inputType: value })}
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
              patchQuestion({ text: e.target.value });
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

        <div className="space-y-2 nodrag">
          <label className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
            Save answer as
          </label>
          <Input
            className="input-field h-8 text-xs"
            placeholder={
              question?.inputType === "address"
                ? "address"
                : question?.inputType === "location"
                  ? "location"
                  : question?.inputType === "media"
                    ? "media"
                    : "name"
            }
            value={question?.attribute || ""}
            onChange={(event) =>
              patchQuestion({
                attribute: event.target.value.replace(/[^a-zA-Z0-9_]/g, ""),
              })
            }
          />
          <p className="text-[11px] text-gray-400">
            Later nodes read this as {`{{${question?.attribute || "reply"}}}`}. The latest message is always {`{{reply}}`}.
          </p>
        </div>

        {question?.inputType === "buttons" ? (
          <div className="space-y-2 nodrag">
            <label className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
              Button options
            </label>
            <Textarea
              className="input-field min-h-16 text-xs nodrag"
              placeholder={"Yes\nNo"}
              value={(question.options || []).join("\n")}
              onChange={(event) =>
                patchQuestion({
                  options: event.target.value.split("\n").slice(0, 3),
                })
              }
            />
            <p className="text-[11px] text-gray-400">One option per line. WhatsApp allows up to 3.</p>
          </div>
        ) : null}

        <label className="flex items-center gap-2 text-xs text-gray-600 nodrag">
          <input
            type="checkbox"
            checked={question?.required !== false}
            onChange={(event) => patchQuestion({ required: event.target.checked })}
          />
          Answer is required
        </label>

        {question?.required !== false ? (
          <div className="space-y-2 nodrag">
            <label className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
              If the answer is invalid
            </label>
            <Input
              className="input-field h-8 text-xs"
              placeholder="That answer was not valid. Please try again."
              value={question?.retryMessage || ""}
              onChange={(event) => patchQuestion({ retryMessage: event.target.value })}
            />
          </div>
        ) : null}

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
