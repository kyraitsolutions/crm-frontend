import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TFlowModalProps = {
  open: boolean;
  onClose: () => void;
  handleSave: (value: string) => void;
};

const FlowModal = ({ open, onClose, handleSave }: TFlowModalProps) => {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    handleSave(name);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-slate-900 backdrop-blur-[1px]" />
      <DialogContent className="sm:max-w-md rounded-xl ">
        <DialogHeader>
          <DialogTitle>Create New Flow</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Enter flow name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              className="actions-btn px-6! py-2! bg-red-500! text-red-100!"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              className="actions-btn px-6! py-2! hover:bg-green-600! hover:text-white!"
              onClick={handleCreate}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlowModal;
