import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { TAiAgentToolConfig } from "../../types/ai-agent.type";
import { fieldHint, fieldLabel } from "../layout/StudioSection";

const SkillConnectedTools = ({
  tools,
  connectedKeys,
  onConnect,
  onDisconnect,
  onDefineNew,
}: {
  tools: TAiAgentToolConfig[];
  connectedKeys: string[];
  onConnect: (key: string) => void;
  onDisconnect: (key: string) => void;
  onDefineNew: () => void;
}) => {
  const available = tools.filter((tool) => !connectedKeys.includes(tool.key));
  const connected = tools.filter((tool) => connectedKeys.includes(tool.key));

  return (
    <div className="space-y-3">
      <div>
        <p className={fieldLabel}>Connected tools / APIs</p>
        <p className={`mt-1 ${fieldHint}`}>
          {connected.length
            ? `${connected.length} API${connected.length === 1 ? "" : "s"} connected.`
            : "No APIs connected yet — answers come from your knowledge base."}
        </p>
      </div>

      {connected.length ? (
        <div className="flex flex-wrap gap-2">
          {connected.map((tool) => (
            <span
              key={tool.key}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
            >
              {tool.name}
              <button
                type="button"
                className="rounded-full p-0.5 text-slate-400 hover:text-slate-700"
                onClick={() => onDisconnect(tool.key)}
                aria-label={`Disconnect ${tool.name}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          key={connectedKeys.join("|")}
          onValueChange={(key) => {
            if (key) onConnect(key);
          }}
        >
          <SelectTrigger className="input-field w-full">
            <SelectValue placeholder="Connect An Existing API..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {available.map((tool) => (
              <SelectItem key={tool.key} value={tool.key}>
                {tool.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" className="h-8 shrink-0 rounded-lg text-xs" onClick={onDefineNew}>
          Define a new API
        </Button>
      </div>
    </div>
  );
};

export default SkillConnectedTools;
