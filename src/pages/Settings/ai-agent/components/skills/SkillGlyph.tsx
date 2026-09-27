import {
  Calendar,
  Filter,
  Gauge,
  Gem,
  Handshake,
  Package,
  Shield,
  Star,
  Tag,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  tag: Tag,
  gauge: Gauge,
  filter: Filter,
  package: Package,
  handshake: Handshake,
  calendar: Calendar,
  shield: Shield,
  star: Star,
  wallet: Wallet,
  gem: Gem,
  zap: Zap,
};

export const SKILL_ICON_OPTIONS = [
  "tag",
  "gauge",
  "filter",
  "package",
  "handshake",
  "calendar",
  "shield",
  "star",
  "wallet",
  "gem",
] as const;

export const SkillGlyph = ({
  icon,
  className = "size-4",
}: {
  icon?: string;
  className?: string;
}) => {
  const Icon = ICONS[icon || ""] || Zap;
  return <Icon className={className} />;
};

export const SkillIconTile = ({
  icon,
  className,
  size = "md",
}: {
  icon?: string;
  className?: string;
  size?: "sm" | "md";
}) => (
  <div
    className={cn(
      "flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
      size === "sm" ? "size-9" : "size-10",
      className,
    )}
  >
    <SkillGlyph icon={icon} className={size === "sm" ? "size-4" : "size-[18px]"} />
  </div>
);

export default SkillGlyph;
