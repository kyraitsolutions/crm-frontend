import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastMessageService } from "@/services";
import { FileText, Globe, Upload } from "lucide-react";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import StudioSection, { fieldHint, fieldLabel } from "../layout/StudioSection";

const toast = new ToastMessageService();

const statusClass = (status: string) => {
  if (status === "ready") return "bg-emerald-50 text-emerald-700";
  if (status === "failed") return "bg-red-50 text-red-700";
  if (status === "processing" || status === "pending") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
};

const statusLabel = (status: string) => {
  if (status === "ready") return "Ready";
  if (status === "failed") return "Failed";
  if (status === "processing") return "Processing";
  if (status === "pending") return "Pending";
  return status;
};

const sourceKind = (type: string) => {
  if (type === "url") return "Website";
  if (type === "file") return "Document";
  if (type === "text" || type === "faq") return "Text";
  if (type === "legacy_whatsapp") return "WhatsApp article";
  return "Knowledge";
};

const KnowledgeSection = () => {
  const knowledge = useAiAgentStudioStore((state) => state.knowledge);
  const createKnowledge = useAiAgentStudioStore((state) => state.createKnowledge);
  const uploadKnowledge = useAiAgentStudioStore((state) => state.uploadKnowledge);
  const removeKnowledge = useAiAgentStudioStore((state) => state.removeKnowledge);
  const reindexKnowledge = useAiAgentStudioStore((state) => state.reindexKnowledge);
  const composer = useAiAgentStudioStore((state) => state.knowledgeComposer);
  const setComposer = useAiAgentStudioStore((state) => state.setKnowledgeComposer);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");

  const addSource = async (payload: {
    type: string;
    title: string;
    content?: string;
    uri?: string;
  }) => {
    setBusy(true);
    try {
      await createKnowledge(payload);
      setUrl("");
      setPasteTitle("");
      setPasteContent("");
      setComposer("idle");
    } catch (error: any) {
      toast.error(error?.message || "Could not add knowledge");
    } finally {
      setBusy(false);
    }
  };

  const crawlPage = async () => {
    let uri = url.trim();
    if (!uri) {
      toast.error("URL is required");
      return;
    }
    if (!/^https?:\/\//i.test(uri)) uri = `https://${uri}`;
    let title = uri;
    try {
      title = new URL(uri).hostname;
    } catch {
      toast.error("Enter a valid URL");
      return;
    }
    await addSource({ type: "url", title, uri, content: "" });
  };

  const pasteText = async () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) {
      toast.error("Title and text are required");
      return;
    }
    await addSource({
      type: "text",
      title: pasteTitle.trim(),
      content: pasteContent.trim(),
    });
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        await uploadKnowledge(file);
      }
    } catch (error: any) {
      toast.error(error?.message || "Could not upload file");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5">
      <StudioSection
        title="Knowledge"
        description="The shared corpus your agent answers from."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            variant={composer === "crawl" ? "default" : "outline"}
            size="sm"
            className="h-8 rounded-lg text-xs! actions-btn px-4!"
            onClick={() => setComposer(composer === "crawl" ? "idle" : "crawl")}
          >
            <Globe className="size-3.5" />
            Crawl page
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs! actions-btn px-4!"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-3.5" />
            Upload file
          </Button>
          <Button
            variant={composer === "paste" ? "default" : "outline"}
            size="sm"
            className="h-8 rounded-lg text-xs! actions-btn px-4!"
            onClick={() => setComposer(composer === "paste" ? "idle" : "paste")}
          >
            <FileText className="size-3.5" />
            Paste text
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            multiple
            onChange={(e) => void uploadFiles(e.target.files)}
          />
        </div>

        <p className={`mt-3 ${fieldHint}`}>
          Add a website, a document, or the text you want Kyra to learn from.
        </p>

        {composer === "crawl" ? (
          <div className="mt-5 space-y-4 rounded-xl border border-slate-200 p-4">
            <div>
              <p className={fieldLabel}>URL</p>
              <Input
                className="input-field mt-1.5"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <p className={fieldHint}>
              Kyra reads the public pages on this site and uses them to answer customers.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" onClick={() => setComposer("idle")}>
                Cancel
              </Button>
              <Button size="sm" className="h-8 rounded-lg text-xs" disabled={busy} onClick={() => void crawlPage()}>
                {busy ? "Starting..." : "Crawl page"}
              </Button>
            </div>
          </div>
        ) : null}

        {composer === "paste" ? (
          <div className="mt-5 space-y-4 rounded-xl border border-slate-200 p-4">
            <div>
              <p className={fieldLabel}>Title</p>
              <Input
                className="input-field mt-1.5"
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
              />
            </div>
            <div>
              <p className={fieldLabel}>Text</p>
              <Textarea
                className="input-field mt-1.5 resize-none"
                rows={8}
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-xl text-xs" onClick={() => setComposer("idle")}>
                Cancel
              </Button>
              <Button size="sm" className="h-8 rounded-xl text-xs" disabled={busy} onClick={() => void pasteText()}>
                {busy ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : null}
      </StudioSection>

      <div className="space-y-2.5">
        {knowledge.map((source) => (
          <div key={source.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{source.title}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {sourceKind(source.type)}
                  {source.uri ? ` · ${source.uri}` : ""}
                  {source.type === "url" && source.documentCount
                    ? ` · ${source.documentCount} pages`
                    : ""}
                  {source.chunkCount ? ` · ${source.chunkCount} knowledge sections` : ""}
                </p>
                {source.status === "pending" || source.status === "processing" ? (
                  <p className="mt-1 text-xs text-amber-700">
                    {source.progressMessage || "Preparing your knowledge..."}
                  </p>
                ) : null}
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusClass(source.status)}`}>
                {statusLabel(source.status)}
              </span>
            </div>
            {source.errorMessage ? (
              <p className="mt-2 text-xs text-red-600">{source.errorMessage}</p>
            ) : null}
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs"
                onClick={() => void reindexKnowledge(source.id)}
              >
                Refresh
              </Button>
              {source.type !== "legacy_whatsapp" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-xs text-red-600"
                  onClick={() =>
                    void removeKnowledge(source.id).catch((error) => toast.error(error?.message))
                  }
                >
                  Remove
                </Button>
              ) : (
                <p className="self-center text-xs text-slate-400">
                  Managed from the existing WhatsApp knowledge editor
                </p>
              )}
            </div>
          </div>
        ))}
        
        {!knowledge.length && composer === "idle" ? (
          <p className="px-1 text-xs text-slate-400">
            No knowledge sources yet. Crawl a page or paste text to get started.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default KnowledgeSection;
