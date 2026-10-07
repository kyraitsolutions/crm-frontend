import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useReactFlow } from "reactflow";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import { WHATSAPP_PATHS } from "@/constants/routes/whatsapp.path";
import GlobalTemplatePreview from "@/pages/Channels/whatsapp/components/GlobalTemplatePreview";
import { whatsappTemplateService } from "@/pages/Channels/whatsapp/services/whatsapp-template.service";
import type {
  TTemplate,
  TTemplateComponent,
} from "@/pages/Channels/whatsapp/types/templates";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type { TAppNodeData, TTemplateNodeDataPayload } from "../types/types";

type TTemplateNodeSettingProps = {
  id?: string;
  data: TAppNodeData;
  onClose?: () => void;
};

function bodyText(components: TTemplateComponent[] | undefined) {
  const body = components?.find((component) => component.type === "BODY");
  return body && "text" in body ? body.text : "";
}

const TemplateNodeSetting = ({ id, data, onClose }: TTemplateNodeSettingProps) => {
  const { setNodes } = useReactFlow();
  const accountId = useAuthStore((state) => state.accountId);
  const toast = new ToastMessageService();
  const saved = data.type === "template" ? data.payload.template : null;

  const [templates, setTemplates] = useState<TTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(saved?.id || "");

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!accountId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await whatsappTemplateService.getTemplates(accountId, {
          status: "APPROVED",
          page: 1,
          limit: 100,
        });
        if (!active) return;
        const docs = (response.data?.docs ?? []) as TTemplate[];
        setTemplates(docs.filter((item) => item.status === "APPROVED"));
      } catch {
        if (active) setTemplates([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [accountId]);

  const visibleTemplates = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return templates;
    return templates.filter((template) =>
      [template.name, template.language, template.category, bodyText(template.components)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [search, templates]);

  const selected = templates.find((template) => template.id === selectedId) || null;

  const handleSave = () => {
    if (!selected) {
      toast.error("Select an approved WhatsApp template");
      return;
    }

    const payload: TTemplateNodeDataPayload = {
      type: "template",
      template: {
        id: selected.id,
        name: selected.name,
        language: selected.language,
        category: selected.category,
        preview: bodyText(selected.components),
      },
    };

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: selected.name,
                type: "template",
                payload,
              },
            }
          : node,
      ),
    );
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold">WhatsApp template</h2>
          <p className="text-xs text-gray-400">
            Choose an approved template to send
          </p>
        </div>
        <ButtonClose onClose={() => onClose?.()} />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div className="space-y-2">
          <label className="inline-block text-sm text-gray-400">
            Approved template
          </label>
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search approved templates"
              className="input-field border-white/15! bg-white/5 pl-8 text-white"
            />
          </div>
        </div>

        <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-sm text-gray-400">Loading templates...</p>
          ) : visibleTemplates.length ? (
            visibleTemplates.map((template) => {
              const active = template.id === selectedId;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedId(template.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                    active
                      ? "bg-emerald-500 text-white"
                      : "bg-white/5 text-gray-200 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{template.name}</p>
                    <span className={`shrink-0 text-[10px] ${active ? "text-white/80" : "text-gray-400"}`}>
                      {template.language}
                    </span>
                  </div>
                  <p className={`mt-0.5 line-clamp-1 text-xs ${active ? "text-white/80" : "text-gray-400"}`}>
                    {template.category}
                    {bodyText(template.components)
                      ? ` · ${bodyText(template.components)}`
                      : ""}
                  </p>
                </button>
              );
            })
          ) : (
            <p className="text-sm text-gray-400">
              {templates.length ? "No templates match that search." : "No approved templates yet. "}
              {!templates.length ? (
                <Link className="text-emerald-300 underline" to={WHATSAPP_PATHS.createTemplates()}>
                  Create a template
                </Link>
              ) : null}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="inline-block text-sm text-gray-400">Preview</label>
          {selected ? (
            <GlobalTemplatePreview
              embedded
              open
              template={selected}
              onClose={() => undefined}
            />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-gray-400">
              Select a template to preview the message.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-white/10 bg-[#0f172a] p-3">
        <Button className="node-setting-footer-btns" onClick={() => onClose?.()}>
          Cancel
        </Button>
        <Button
          className="node-setting-footer-btns node-setting-footer-btns-save"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TemplateNodeSetting;
