import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  count: number;
  saving?: boolean;
  onClose: () => void;
  onConfirm: (deleteContact: boolean) => void;
};

const DeleteChatDialog = ({
  open,
  count,
  saving,
  onClose,
  onConfirm,
}: Props) => {
  const [deleteContact, setDeleteContact] = useState(false);
  const label = count > 1 ? `${count} chats` : "this chat";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setDeleteContact(false);
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Delete {label}?</DialogTitle>
          <DialogDescription>
            Conversations move to Recycle Bin for 30 days. You can restore them
            from Settings → Recycle Bin.
          </DialogDescription>
        </DialogHeader>

        <label className="flex items-start gap-3 rounded-xl border p-3 text-sm">
          <Checkbox
            checked={deleteContact}
            onCheckedChange={(checked) => setDeleteContact(Boolean(checked))}
          />
          <span>
            Also delete the related contact
            <span className="block text-xs text-gray-500 mt-1">
              The contact is moved to Recycle Bin and can be restored within 30
              days.
            </span>
          </span>
        </label>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-red-600 hover:bg-red-600/90"
            disabled={saving}
            onClick={() => onConfirm(deleteContact)}
          >
            {saving ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChatDialog;
