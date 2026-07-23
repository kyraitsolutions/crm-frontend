import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface ButtonCardProps {
  children: ReactNode;
  onDelete: () => void;
}

export function ButtonCard({ children, onDelete }: ButtonCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        {/* Content */}
        <div className="min-w-0 flex-1">{children}</div>

        {/* Delete */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
