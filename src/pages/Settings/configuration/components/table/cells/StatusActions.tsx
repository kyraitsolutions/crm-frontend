import { Button } from "@/components/ui/button";

import { Pencil, Trash2 } from "lucide-react";

interface StatusActionsProps {
  row: any;
  onEdit: () => void;
  onDelete: () => void;
}

const StatusActions = ({ row, onEdit, onDelete }: StatusActionsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={onEdit}
        className="flex size-7 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200"
      >
        <Pencil className="size-4 text-gray-600" />
      </Button>

      {!row.system && (
        <Button
          onClick={onDelete}
          className="flex size-7 items-center justify-center rounded-xl bg-red-100 hover:bg-red-200"
        >
          <Trash2 className="size-4 text-red-500" />
        </Button>
      )}
    </div>
  );
};

export default StatusActions;
