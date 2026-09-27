import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToastMessageService } from "@/services";
import { Copy, Pencil, Plus, Trash2, Zap } from "lucide-react";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import type { TAiAgentToolConfig } from "../../types/ai-agent.type";
import CustomActionDialog from "../dialogs/CustomActionDialog";
import StudioSection, { fieldHint, studioRow } from "../layout/StudioSection";

const toast = new ToastMessageService();

const ActionsSection = () => {
  const config = useAiAgentStudioStore((state) => state.config);
  const patchConfig = useAiAgentStudioStore((state) => state.patchConfig);
  const saveDraft = useAiAgentStudioStore((state) => state.saveDraft);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TAiAgentToolConfig | null>(null);

  const business = config.tools.filter((tool) => tool.type === "business");
  const system = config.tools.filter((tool) => tool.type === "system");
  const custom = config.tools.filter((tool) => tool.type === "custom_api");

  const groups = useMemo(() => {
    const map = new Map<string, TAiAgentToolConfig[]>();
    for (const tool of custom) {
      const group = String(tool.config?.intentGroup || "CUSTOM");
      map.set(group, [...(map.get(group) || []), tool]);
    }
    return Array.from(map.entries());
  }, [custom]);

  const upsertTool = (next: TAiAgentToolConfig) => {
    const exists = config.tools.some((tool) => tool.key === next.key);
    const tools = exists
      ? config.tools.map((tool) => (tool.key === next.key ? next : tool))
      : [...config.tools, next];
    patchConfig({ tools });
    void saveDraft({ tools });
  };

  return (
    <div className="space-y-5">
      <StudioSection
        title="Actions"
        description="The agent calls a custom API when the customer message matches that action."
      >
        <p className="mb-3 text-[10px] font-medium tracking-[0.14em] text-slate-400 uppercase">
          Business
        </p>
        {business.length ? (
          <div className="space-y-2">
            {business.map((tool) => (
              <div
                key={tool.key}
                className={`flex items-center justify-between px-3.5 py-3 ${studioRow}`}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{tool.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{tool.description}</p>
                </div>
                <Switch
                  checked={tool.enabled}
                  onCheckedChange={(enabled) =>
                    patchConfig({
                      tools: config.tools.map((item) =>
                        item.key === tool.key ? { ...item, enabled } : item,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={fieldHint}>No business actions yet.</p>
        )}
      </StudioSection>

      <StudioSection title="Custom API actions ">
        {groups.map(([group, tools]) => (
          <div key={group} className="space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {group.replaceAll("_", ", ")}
              </p>
              <p className="text-xs text-slate-400">
                {tools.length} action{tools.length === 1 ? "" : "s"}
              </p>
            </div>
            
            {tools.map((tool) => {
              const endpoint = String(tool.config?.endpoint || "");
              const method = String(tool.config?.method || "GET").toUpperCase();
              return (
                <div
                  key={tool.key}
                  className={`flex items-center justify-between gap-3 px-3.5 py-3 ${studioRow}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Zap className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-slate-950">{tool.name}</p>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600">
                          {method}
                        </span>
                      </div>
                      {endpoint ? (
                        <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">{endpoint}</p>
                      ) : (
                        <p className="mt-0.5 font-mono text-[11px] text-slate-400">{tool.key}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <span className="mr-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Connected
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => {
                        void navigator.clipboard.writeText(endpoint || tool.key);
                        toast.success("Copied");
                      }}
                    >
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => {
                        setEditing(tool);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-red-500"
                      onClick={() =>
                        patchConfig({
                          tools: config.tools.filter((item) => item.key !== tool.key),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <button
          type="button"
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-3 text-xs font-medium text-slate-600 transition-colors hover:border-primary/40 hover:bg-white hover:text-primary"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-3.5" />
          Add custom API action
        </button>
      </StudioSection>

      <StudioSection title="System actions">
        <div className="flex flex-wrap gap-2">
          {system.map((tool) => (
            <span
              key={tool.key}
              className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-600"
            >
              {tool.key}
            </span>
          ))}
        </div>
        <p className={`mt-3 ${fieldHint}`}>Built-in — always available to the agent.</p>
        {system.length ? (
          <div className="mt-4 space-y-3">
            {system.map((tool) => (
              <div key={tool.key} className={`flex items-center justify-between px-3.5 py-2.5 ${studioRow}`}>
                <span className="text-xs text-slate-700">{tool.name}</span>
                <Switch
                  checked={tool.enabled}
                  onCheckedChange={(enabled) =>
                    patchConfig({
                      tools: config.tools.map((item) =>
                        item.key === tool.key ? { ...item, enabled } : item,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        ) : null}
      </StudioSection>

      <CustomActionDialog
        open={open}
        tool={editing}
        onOpenChange={setOpen}
        onSave={upsertTool}
      />
    </div>
  );
};

export default ActionsSection;
