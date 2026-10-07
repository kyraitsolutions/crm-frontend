import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

type GenerateFlowModalProps = {
  open: boolean;
  loading: boolean;
  flowName?: string;
  onClose: () => void;
  onGenerate: (value: { name: string; prompt: string }) => void;
};

const GenerateFlowModal = ({
  open,
  loading,
  flowName = "",
  onClose,
  onGenerate,
}: GenerateFlowModalProps) => {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(flowName);
    setPrompt("");
  }, [open, flowName]);

  const submit = () => {
    if (!prompt.trim() || loading) return;
    onGenerate({ name: name.trim(), prompt: prompt.trim() });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !loading) onClose();
      }}
    >
      <DialogOverlay className="bg-slate-900/10 backdrop-blur-[1px]" />
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate with AI</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Name</label>
            <Input
              placeholder="Flow name"
              className="input-field rounded-xl!"
              value={name}
              disabled={loading}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Prompt</label>
            <Textarea
              placeholder="Welcome the customer, ask how many leads they get each month, save it, and thank them."
              className="input-field min-h-28 rounded-xl!"
              value={prompt}
              disabled={loading}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              className="actions-btn rounded-xl! bg-red-600! px-6! py-2! text-red-100!"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="actions-btn rounded-xl! px-6! py-2! hover:bg-primary! hover:text-white!"
              disabled={loading || !prompt.trim()}
              onClick={submit}
            >
              Generate
              {loading ? <Loader /> : null}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateFlowModal;
