import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIService } from "@/services/ai.service";
import { ToastMessageService } from "@/services";
import {
  Method,
  TemplateCategory,
  type EmailTemplateData,
} from "@/types/email.type";
import { Edit3, Sparkles } from "lucide-react";
import { useState } from "react";
import { emailMarketingService } from "../services/email-marketing.service";

type CreateTemplateDialogProps = {
  open: boolean;
  onClose: () => void;
  accountId: string;
  onCreated: () => void;
};

export function CreateTemplateDialog({
  open,
  onClose,
  accountId,
  onCreated,
}: CreateTemplateDialogProps) {
  const aiService = new AIService();
  const toast = new ToastMessageService();
  const [mode, setMode] = useState<Method | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const [templateData, setTemplateData] = useState<EmailTemplateData>({
    name: "New Template",
    subject: "Welcome to our service",
    html: "<h1>Hello {{firstName}}</h1>",
    variables: ["firstName"],
    category: TemplateCategory.NOTIFICATION,
  });

  const reset = () => {
    setMode(null);
    setAiPrompt("");
    setSaving(false);
  };

  const save = async (payload: EmailTemplateData) => {
    setSaving(true);
    try {
      await emailMarketingService.createTemplate(accountId, payload);
      toast.success("Template saved");
      onCreated();
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Could not save template");
    } finally {
      setSaving(false);
    }
  };

  const handleManualChange = (field: string, value: string) => {
    setTemplateData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    try {
      setSaving(true);
      const result = await aiService.createTemplateWithAI(accountId, aiPrompt);
      const generated = result.data?.doc || result.data || {};
      await save({
        name: generated.name || "AI template",
        subject: generated.subject || "New campaign",
        html: generated.html || generated.body || "<p></p>",
        variables: generated.variables || ["firstName"],
        category: generated.category || TemplateCategory.MARKETING,
        generatedBy: Method.AI,
      });
    } catch (error: any) {
      setSaving(false);
      toast.error(error?.message || "AI could not generate this template");
    }
  };

  const handleSaveManual = () => {
    void save({ ...templateData, generatedBy: Method.USER });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        reset();
        onClose();
      }}
    >
      <DialogContent className="max-w-xl rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Email Template
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
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Manual Template</h3>
            <input
              placeholder="Template name"
              className="w-full rounded-md border p-2 text-sm"
              onChange={(e) => handleManualChange("name", e.target.value)}
            />
            <input
              placeholder="Email subject"
              className="w-full rounded-md border p-2 text-sm"
              onChange={(e) => handleManualChange("subject", e.target.value)}
            />
            <textarea
              placeholder="Write your email content here"
              className="w-full h-32 rounded-md border p-3 text-sm"
              onChange={(e) => handleManualChange("html", e.target.value)}
            />
            <select
              className="w-full rounded-md border p-2 text-sm"
              onChange={(e) => handleManualChange("category", e.target.value)}
            >
              <option value="">Select Category</option>
              {Object.values(TemplateCategory).map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMode(null)}>
                Back
              </Button>
              <Button disabled={saving} onClick={handleSaveManual}>
                Save Template
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
