import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  title: string;
  description: string;
}

export const SectionHeader = ({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className={`rounded-full border p-2 ${iconBg}`}>
        <Icon className={`${iconColor} size-4`} />
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
