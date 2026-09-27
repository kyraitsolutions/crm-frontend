import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const fieldLabel = "text-xs font-medium text-slate-600";
export const fieldHint = "text-xs leading-5 text-slate-400";
export const studioRow =
  "rounded-xl border border-slate-200/80 bg-white transition-colors hover:border-primary/25";

const StudioSection = ({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}) => (
  <section
    className={cn(
      "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
      className,
    )}
  >
    <div className={cn("flex items-start justify-between gap-4", children ? "mb-5" : "")}>
      <div className="min-w-0 space-y-1">
        <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-xs leading-5 text-slate-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
    {children}
  </section>
);

export default StudioSection;
