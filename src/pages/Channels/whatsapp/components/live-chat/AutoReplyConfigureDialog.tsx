import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WHATSAPP_PATHS } from "@/constants/routes/whatsapp.path";
import { Link } from "react-router-dom";
import type {
  AutoReplyConfig,
  AutoReplyType,
  LiveChatTemplateOption,
} from "../../types/live-chat.type";

type Props = {
  open: boolean;
  title: string;
  description: string;
  saving?: boolean;
  value: AutoReplyConfig;
  templates: LiveChatTemplateOption[];
  onChange: (value: AutoReplyConfig) => void;
  onClose: () => void;
  onSave: () => void;
};

const AutoReplyConfigureDialog = ({
  open,
  title,
  description,
  saving,
  value,
  templates,
  onChange,
  onClose,
  onSave,
}: Props) => {
  const selected = templates.find(
    (item) => item.id === value.templateId || item.name === value.templateName,
  );

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-3">
            <Label>Message type</Label>
            <RadioGroup
              value={value.type}
              onValueChange={(type) =>
                onChange({ ...value, type: type as AutoReplyType })
              }
              className="flex gap-6"
            >
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="text" />
                Text
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="template" />
                Template
              </label>
            </RadioGroup>
          </div>

          {value.type === "text" ? (
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={value.text || ""}
                maxLength={1024}
                rows={5}
                className="rounded-xl resize-none"
                onChange={(event) =>
                  onChange({ ...value, text: event.target.value })
                }
                placeholder="Enter the first-query reply"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Approved template</Label>
              {templates.length ? (
                <Select
                  value={selected?.id || ""}
                  onValueChange={(templateId) => {
                    const template = templates.find((item) => item.id === templateId);
                    onChange({
                      ...value,
                      templateId,
                      templateName: template?.name || "",
                      language: template?.language || "en",
                    });
                  }}
                >
                  <SelectTrigger className="rounded-xl w-full">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.language})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-500">
                  No approved templates yet.{" "}
                  <Link
                    className="text-teal-800 underline"
                    to={WHATSAPP_PATHS.createTemplates()}
                  >
                    Create a template
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-teal-900 hover:bg-teal-900/80"
            disabled={saving}
            onClick={onSave}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoReplyConfigureDialog;
