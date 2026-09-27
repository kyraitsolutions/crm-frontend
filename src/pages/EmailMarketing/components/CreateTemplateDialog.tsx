import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RichTextEmailEditor,
  type EmailVariable,
  type RichTextEmailValue,
} from "@/components/email/RichTextEmailEditor";
import { AIService } from "@/services/ai.service";
import { ToastMessageService } from "@/services";
import {
  Method,
  TemplateCategory,
  type EmailTemplateData,
  type EmailTemplateDesign,
} from "@/types/email.type";
import {
  extractTemplateVariables,
  isRichTextEmpty,
  looksLikeHtml,
  plainTextToEmailHtml,
  quillHtmlToEmailHtml,
  toDisplayEmailHtml,
} from "@/utils/email-html.utils";
import { Edit3, Sparkles } from "lucide-react";
import { Delta, type Op } from "quill";
import { useEffect, useMemo, useState } from "react";
import { emailMarketingService } from "../services/email-marketing.service";
import type { EmailTemplate } from "../types";

type CreateTemplateDialogProps = {
  open: boolean;
  onClose: () => void;
  accountId: string;
  onCreated: () => void;
  template?: EmailTemplate | null;
};

const TEMPLATE_VARIABLES: EmailVariable[] = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "organizationName", label: "Organization" },
];

const isQuillDesign = (design: EmailTemplate["design"]): design is EmailTemplateDesign =>
  design?.editor === "quill" && Array.isArray(design.delta?.ops);

export function CreateTemplateDialog({
  open,
  onClose,
  accountId,
  onCreated,
  template,
}: CreateTemplateDialogProps) {
  const aiService = new AIService();
  const toast = new ToastMessageService();
  const isEditing = Boolean(template);
  const [chosenMode, setMode] = useState<Method | null>(null);
  const mode = isEditing ? Method.USER : chosenMode;
  const [aiPrompt, setAiPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TemplateCategory>(TemplateCategory.MARKETING);
  const [content, setContent] = useState<RichTextEmailValue | null>(null);

  useEffect(() => {
    if (!open) return;
    setMode(null);
    setAiPrompt("");
    setSaving(false);
    setName(template?.name ?? "");
    setSubject(template?.subject ?? "");
    setCategory((template?.category as TemplateCategory) || TemplateCategory.MARKETING);
    setContent(null);
  }, [open, template]);

  const editorDefaultValue = useMemo(() => {
    if (!template) return "";
    if (isQuillDesign(template.design)) return new Delta(template.design.delta.ops as Op[]);
    const html = String(template.html || "");
    return looksLikeHtml(html) ? html : plainTextToEmailHtml(html);
  }, [template]);

  const isExternalHtml =
    Boolean(template) &&
    !isQuillDesign(template?.design) &&
    looksLikeHtml(String(template?.html || ""));

  const close = () => {
    setMode(null);
    onClose();
  };

  const persist = async (payload: EmailTemplateData) => {
    setSaving(true);
    try {
      const templateId = String(template?.id || template?._id || "");
      if (templateId) {
        await emailMarketingService.updateTemplate(accountId, templateId, payload);
        toast.success("Template updated");
      } else {
        await emailMarketingService.createTemplate(accountId, payload);
        toast.success("Template saved");
      }
      onCreated();
      close();
    } catch (error: any) {
      toast.error(error?.message || "Could not save template");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setSaving(true);
      const result = await aiService.createTemplateWithAI(accountId, aiPrompt);
      const generated = result.data?.doc || result.data || {};
      const html = toDisplayEmailHtml(generated.html || generated.body) || "<p></p>";
      await persist({
        name: generated.name || "AI template",
        subject: generated.subject || "New campaign",
        html,
        variables: generated.variables || extractTemplateVariables(html),
        category: generated.category || TemplateCategory.MARKETING,
        generatedBy: Method.AI,
      });
    } catch (error: any) {
      setSaving(false);
      toast.error(error?.message || "AI could not generate this template");
    }
  };

  const handleSaveManual = () => {
    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (!subject.trim()) {
      toast.error("Email subject is required");
      return;
    }

    const html = content ? quillHtmlToEmailHtml(content.html) : String(template?.html || "");
    if (content ? isRichTextEmpty(content.html) : !html.trim()) {
      toast.error("Write the email content");
      return;
    }

    const existingDesign = template?.design;
    const design: EmailTemplateDesign | undefined = content
      ? { editor: "quill", version: 1, delta: { ops: content.delta.ops } }
      : isQuillDesign(existingDesign)
        ? existingDesign
        : undefined;

    void persist({
      name: name.trim(),
      subject: subject.trim(),
      html,
      variables: extractTemplateVariables(`${subject} ${html}`),
      category,
      generatedBy: isEditing ? (template?.generatedBy as Method) || Method.USER : Method.USER,
      ...(design ? { design } : {}),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <DialogContent
        className={`max-h-[92vh] overflow-y-auto rounded-md ${
          mode === Method.USER ? "sm:max-w-3xl" : "sm:max-w-xl"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? "Edit Email Template" : "Create Email Template"}
          </DialogTitle>
        </DialogHeader>

        {!mode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Card
              onClick={() => setMode(Method.AI)}
              className="cursor-pointer hover:shadow-lg transition border-dashed"
            >
              <CardContent className="p-6 text-center space-y-3">
                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                <h3 className="font-semibold text-lg">Generate with AI</h3>
                <p className="text-sm text-muted-foreground">
                  Let AI create a high-converting email for you
                </p>
              </CardContent>
            </Card>

            <Card
              onClick={() => setMode(Method.USER)}
              className="cursor-pointer hover:shadow-lg transition"
            >
              <CardContent className="p-6 text-center space-y-3">
                <Edit3 className="mx-auto h-8 w-8 text-primary" />
                <h3 className="font-semibold text-lg">Create Manually</h3>
                <p className="text-sm text-muted-foreground">
                  Start from scratch or use your own design
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {mode === Method.AI && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Describe your email</h3>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Write a follow-up email for hotel website leads..."
              className="w-full h-32 rounded-md border p-3 text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMode(null)}>
                Back
              </Button>
              <Button disabled={saving || !aiPrompt.trim()} onClick={handleGenerate}>
                Generate Template
              </Button>
            </div>
          </div>
        )}

        {mode === Method.USER && (
          <div className="mt-2 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                value={name}
                placeholder="Template name"
                className="w-full rounded-md border p-2 text-sm"
                onChange={(e) => setName(e.target.value)}
              />
              <select
                value={category}
                className="w-full rounded-md border p-2 text-sm capitalize"
                onChange={(e) => setCategory(e.target.value as TemplateCategory)}
              >
                {Object.values(TemplateCategory).map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <input
              value={subject}
              placeholder="Email subject"
              className="w-full rounded-md border p-2 text-sm"
              onChange={(e) => setSubject(e.target.value)}
            />

            {isExternalHtml && (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                This template was built outside the editor. Editing the content
                here can simplify its layout (tables, columns, custom styles).
              </p>
            )}

            <RichTextEmailEditor
              key={String(template?.id || template?._id || "new")}
              defaultValue={editorDefaultValue}
              onChange={setContent}
              variables={TEMPLATE_VARIABLES}
              placeholder="Write your email content here..."
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => (isEditing ? close() : setMode(null))}
              >
                {isEditing ? "Cancel" : "Back"}
              </Button>
              <Button disabled={saving} onClick={handleSaveManual}>
                {saving ? "Saving..." : isEditing ? "Update Template" : "Save Template"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
