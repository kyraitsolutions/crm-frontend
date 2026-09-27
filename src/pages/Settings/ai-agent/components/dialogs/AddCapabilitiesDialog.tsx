import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToastMessageService } from "@/services";
import { Plus, Search, Sparkles } from "lucide-react";
import {
  PREBUILT_SKILLS,
  catalogToSkill,
} from "../../constants/skill-catalog.constant";
import { aiAgentStudioService } from "../../services/ai-agent.service";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import type { TAiAgentSkillConfig, TAiSkillCatalogItem } from "../../types/ai-agent.type";
import { SkillIconTile } from "../skills/SkillGlyph";
import CreateSkillDialog from "./CreateSkillDialog";

const toast = new ToastMessageService();

const AddCapabilitiesDialog = ({
  open,
  existing,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  existing: TAiAgentSkillConfig[];
  onOpenChange: (open: boolean) => void;
  onAdd: (skills: TAiAgentSkillConfig[]) => void;
}) => {
  const accountId = useAiAgentStudioStore((state) => state.accountId);
  const [query, setQuery] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [catalog, setCatalog] = useState<TAiSkillCatalogItem[]>(PREBUILT_SKILLS);

  useEffect(() => {
    if (!open || !accountId) return;
    setQuery("");
    void aiAgentStudioService
      .listSkillCatalog(accountId)
      .then((response) => {
        const next = response.data?.doc?.catalog;
        if (Array.isArray(next) && next.length) setCatalog(next);
      })
      .catch(() => {
        setCatalog(PREBUILT_SKILLS);
      });
  }, [open, accountId]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return catalog;
    return catalog.filter(
      (item) =>
        item.name.toLowerCase().includes(needle) ||
        item.whenToUse.toLowerCase().includes(needle),
    );
  }, [catalog, query]);

  const hasType = (type: string) => existing.some((skill) => (skill.type || skill.key) === type);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl sm:max-w-3xl">
          <DialogHeader>
            <div className="flex flex-wrap items-start justify-between gap-3 pr-6">
              <div>
                <DialogTitle className="text-sm">Add capabilities</DialogTitle>
                <DialogDescription className="text-xs">
                  Browse prebuilt skills, or create your own.
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs"
                onClick={() => {
                  onOpenChange(false);
                  setCustomOpen(true);
                }}
              >
                <Sparkles className="size-3.5" />
                Create custom
              </Button>
            </div>
          </DialogHeader>

          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="input-field pl-9"
              placeholder="Search capabilities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item) => {
              const added = hasType(item.type);
              return (
                <div
                  key={item.type}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <SkillIconTile icon={item.icon} size="sm" />
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 shrink-0 rounded-lg px-3 text-xs"
                      disabled={added}
                      onClick={() => {
                        onAdd([catalogToSkill(item)]);
                        toast.success(`${item.name} added`);
                      }}
                    >
                      <Plus className="size-3.5" />
                      {added ? "Added" : "Add"}
                    </Button>
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">{item.whenToUse}</p>
                </div>
              );
            })}
            {!filtered.length ? (
              <p className="col-span-full py-8 text-center text-xs text-slate-400">
                No capabilities match that search.
              </p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <CreateSkillDialog
        open={customOpen}
        existing={existing}
        onOpenChange={setCustomOpen}
        onAdd={(skill) => onAdd([skill])}
      />
    </>
  );
};

export default AddCapabilitiesDialog;
