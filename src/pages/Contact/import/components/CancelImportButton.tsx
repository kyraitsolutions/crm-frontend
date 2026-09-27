import ConfirmModal from "@/components/confirm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CancelImportButtonProps {
  onCancel: () => Promise<void>;
  disabled?: boolean;
}

export function CancelImportButton({ onCancel, disabled }: CancelImportButtonProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={disabled || busy}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        Cancel import
      </Button>
      <ConfirmModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        title="Cancel this import?"
        description="This job will be closed so you can start a new upload. The file will not be imported."
        confirmText="Cancel import"
        loading={busy}
        onConfirm={async () => {
          setBusy(true);
          try {
            await onCancel();
            setOpen(false);
          } finally {
            setBusy(false);
          }
        }}
      />
    </>
  );
}
