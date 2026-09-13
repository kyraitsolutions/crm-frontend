import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, MessageCircle } from "lucide-react";

type BroadcastChannelDialogProps = {
  open: boolean;
  count: number;
  onClose: () => void;
  onSelectEmail: () => void;
  onSelectWhatsApp: () => void;
};

export function BroadcastChannelDialog({
  open,
  count,
  onClose,
  onSelectEmail,
  onSelectWhatsApp,
}: BroadcastChannelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Broadcast</DialogTitle>
          <DialogDescription>
            Send to {count} selected contact{count === 1 ? "" : "s"}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onSelectEmail}
            className="flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition hover:border-primary hover:bg-primary/5"
          >
            <Mail className="h-6 w-6 text-primary" />
            Email
          </button>
          <button
            type="button"
            onClick={onSelectWhatsApp}
            className="flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition hover:border-primary hover:bg-primary/5"
          >
            <MessageCircle className="h-6 w-6 text-primary" />
            WhatsApp
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
