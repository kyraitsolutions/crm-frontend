import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        `relative overflow-hidden rounded-xl border border-gray-200  bg-white/40 backdrop-blur-xl`,
        className,
      )}
    >
      <div className=" absolute inset-0" />
      {children}
    </div>
  );
}
