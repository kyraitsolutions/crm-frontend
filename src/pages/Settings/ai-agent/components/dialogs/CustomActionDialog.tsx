import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastMessageService } from "@/services";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { HTTP_METHODS, SENSITIVITY_OPTIONS } from "../../constants/ai-agent.constant";
import type { TAiAgentToolConfig, TCustomApiForm, TCustomApiKv } from "../../types/ai-agent.type";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import { aiAgentStudioService } from "../../services/ai-agent.service";
import {
  customApiFormToTool,
  emptyCustomApiForm,
  kvToRecord,
  parseCurl,
  toolToCustomApiForm,
} from "../../utils/action.utils";

const toast = new ToastMessageService();
const field = "text-xs font-medium text-slate-600";

type RequestTab = "headers" | "params" | "auth";

const KvEditor = ({
  rows,
  onChange,
}: {
  rows: TCustomApiKv[];
  onChange: (rows: TCustomApiKv[]) => void;
}) => (
  <div className="space-y-2">
    {rows.map((row, index) => (
      <div key={index} className="flex gap-2">
        <Input
          className="input-field"
          placeholder="Key"
          value={row.key}
          onChange={(e) =>
            onChange(rows.map((item, i) => (i === index ? { ...item, key: e.target.value } : item)))
          }
        />
        <Input
          className="input-field"
          placeholder="Value"
          value={row.value}
          onChange={(e) =>
            onChange(
              rows.map((item, i) => (i === index ? { ...item, value: e.target.value } : item)),
            )
          }
        />
        <Button
          type="button"
          variant="ghost"
          className="rounded-2xl"
          onClick={() => onChange(rows.filter((_, i) => i !== index))}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ))}
    <Button
      type="button"
      variant="ghost"
      className="rounded-xl px-0 text-primary"
      onClick={() => onChange([...rows, { key: "", value: "" }])}
    >
      + Add row
    </Button>
  </div>
);

const CustomActionDialog = ({
  open,
  tool,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  tool?: TAiAgentToolConfig | null;
  onOpenChange: (open: boolean) => void;
  onSave: (next: TAiAgentToolConfig) => void;
}) => {
  const [form, setForm] = useState<TCustomApiForm>(emptyCustomApiForm());
  const [curl, setCurl] = useState("");
  const [requestTab, setRequestTab] = useState<RequestTab>("headers");
  const [testing, setTesting] = useState(false);
  const [preview, setPreview] = useState("");
  const accountId = useAiAgentStudioStore((state) => state.accountId);

  useEffect(() => {
    if (!open) return;
    setForm(toolToCustomApiForm(tool));
    setCurl("");
    setRequestTab("headers");
    setPreview("");
  }, [open, tool]);

  const testCall = async () => {
    if (!form.endpoint.trim()) {
      toast.error("Request URL is required");
      return;
    }
    if (!accountId) return;
    setTesting(true);
    setPreview("");
    try {
      const response = await aiAgentStudioService.testCustomApi(accountId, {
        method: form.method,
        endpoint: form.endpoint.trim(),
        headers: kvToRecord(form.headers),
        params: kvToRecord(form.params),
        authType: form.authType,
        authToken: form.authToken,
      });
      const doc = response?.data?.doc;
      const items = (doc?.body as { items?: Array<{ title?: string; name?: string; price?: number }> })
        ?.items;
      const lines = Array.isArray(items)
        ? items
            .slice(0, 5)
            .map((item) => `${item.title || item.name || "Item"}${item.price != null ? ` — ${item.price}` : ""}`)
            .join("\n")
        : JSON.stringify(doc?.body ?? {}, null, 2).slice(0, 800);
      setPreview(
        doc?.ok
          ? `HTTP ${doc.status}\n${lines}`
          : `HTTP ${doc?.status || "failed"}\n${doc?.error || lines}`,
      );
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as { message?: string }).message || "")
          : "";
      toast.error(message || "Could not reach this API");
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tool ? "Edit custom action" : "Add custom API action"}</DialogTitle>
          <DialogDescription>
            Let your agent call any endpoint on your systems.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className={field}>Action name</p>
            <Input
              className="input-field mt-1.5"
              placeholder="Order status"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <p className={field}>When should the agent call it?</p>
            <Textarea
              className="input-field mt-1.5 resize-y"
              rows={3}
              placeholder="When the customer asks which products you sell, their price, or the catalog."
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            Examples are sample customer phrases, not the API response. A URL with {"{id}"} runs
            after the customer picks one item from the list.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className={field}>Intent group</p>
              <Input
                className="input-field mt-1.5"
                placeholder="fetch_order_status"
                value={form.intentGroup}
                onChange={(e) => setForm((prev) => ({ ...prev, intentGroup: e.target.value }))}
              />
            </div>
            <div>
              <p className={field}>Sensitivity</p>
              <Select
                value={form.sensitivity}
                onValueChange={(sensitivity) => setForm((prev) => ({ ...prev, sensitivity }))}
              >
                <SelectTrigger className="input-field mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {SENSITIVITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className={field}>Examples (optional, 1-5)</p>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-primary"
                onClick={() =>
                  setForm((prev) =>
                    prev.examples.length >= 5
                      ? prev
                      : { ...prev, examples: [...prev.examples, ""] },
                  )
                }
              >
                + Add example
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {form.examples.map((example, index) => (
                <Input
                  key={index}
                  className="input-field"
                  placeholder="I want the slim fit t-shirt"
                  value={example}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      examples: prev.examples.map((item, i) =>
                        i === index ? e.target.value : item,
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className={field}>Paste cURL</p>
            <Textarea
              className="input-field mt-1.5 resize-none font-mono text-xs"
              rows={3}
              placeholder="curl -X GET 'https://api.example.com/orders' -H 'Content-Type: application/json'"
              value={curl}
              onChange={(e) => setCurl(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-2 rounded-xl"
              onClick={() => {
                const parsed = parseCurl(curl);
                if (!parsed.endpoint) {
                  toast.error("Could not read a URL from that cURL");
                  return;
                }
                setForm((prev) => ({
                  ...prev,
                  method: parsed.method,
                  endpoint: parsed.endpoint,
                  headers: parsed.headers.length ? parsed.headers : prev.headers,
                }));
                toast.success("Request filled from cURL");
              }}
            >
              Apply cURL
            </Button>
          </div>

          <div>
            <p className={field}>Request</p>
            <div className="mt-1 flex gap-2">
              <Select
                value={form.method}
                onValueChange={(method) => setForm((prev) => ({ ...prev, method }))}
              >
                <SelectTrigger className="input-field w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {HTTP_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="input-field"
                placeholder="https://fakestoreapi.com/products"
                value={form.endpoint}
                onChange={(e) => setForm((prev) => ({ ...prev, endpoint: e.target.value }))}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              For one product after a tap, use the same URL plus {"{id}"}, for example
              https://fakestoreapi.com/products/{"{id}"}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className={field}>Image field</p>
              <Input
                className="input-field mt-1.5"
                placeholder="image"
                value={form.imageField}
                onChange={(e) => setForm((prev) => ({ ...prev, imageField: e.target.value }))}
              />
            </div>
            <div>
              <p className={field}>Fields to send</p>
              <Input
                className="input-field mt-1.5"
                placeholder="title, price, description"
                value={form.replyFields}
                onChange={(e) => setForm((prev) => ({ ...prev, replyFields: e.target.value }))}
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-slate-400">
            Image field is the JSON key for the photo, usually image. What happens after a product
            is tapped is a ground rule on the Voice tab.
          </p>

          <div className="flex gap-4 border-b border-slate-200 text-sm">
            {(["headers", "params", "auth"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                className={clsx(
                  "border-b-2 px-1 pb-2 capitalize",
                  requestTab === tab
                    ? "border-slate-900 font-medium text-slate-900"
                    : "border-transparent text-slate-500",
                )}
                onClick={() => setRequestTab(tab)}
              >
                {tab}
                {tab === "headers" ? ` (${form.headers.filter((row) => row.key).length})` : ""}
              </button>
            ))}
          </div>

          {requestTab === "headers" ? (
            <KvEditor
              rows={form.headers}
              onChange={(headers) => setForm((prev) => ({ ...prev, headers }))}
            />
          ) : null}
          {requestTab === "params" ? (
            <KvEditor
              rows={form.params}
              onChange={(params) => setForm((prev) => ({ ...prev, params }))}
            />
          ) : null}
          {requestTab === "auth" ? (
            <div className="space-y-3">
              <Select
                value={form.authType}
                onValueChange={(authType: "none" | "bearer") =>
                  setForm((prev) => ({ ...prev, authType }))
                }
              >
                <SelectTrigger className="input-field w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">No auth</SelectItem>
                  <SelectItem value="bearer">Bearer token</SelectItem>
                </SelectContent>
              </Select>
              {form.authType === "bearer" ? (
                <Input
                  className="input-field"
                  type="password"
                  placeholder="Token"
                  value={form.authToken}
                  onChange={(e) => setForm((prev) => ({ ...prev, authToken: e.target.value }))}
                />
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-start justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl"
            disabled={testing}
            onClick={() => void testCall()}
          >
            {testing ? "Testing..." : "Test call"}
          </Button>
          {preview ? (
            <pre className="max-h-32 flex-1 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
              {preview}
            </pre>
          ) : (
            <p className="pt-2 text-xs text-slate-400">
              Try GET https://fakestoreapi.com/products before saving.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="rounded-2xl"
            onClick={() => {
              if (!form.name.trim()) {
                toast.error("Action name is required");
                return;
              }
              if (!form.description.trim()) {
                toast.error("Say when the agent should call this API");
                return;
              }
              if (!form.endpoint.trim()) {
                toast.error("Request URL is required");
                return;
              }
              onSave(customApiFormToTool(form));
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomActionDialog;
