import { cn } from "@/lib/utils";
import { getActorConfig } from "../constants/activity.constants";
// import { getInitials } from "../utils/activity-logs.utils";
import type { ActivityActor } from "../types/activity-log.type";

interface ActivityLogAvatarProps {
  actor: ActivityActor;
  size?: "sm" | "md";
  className?: string;
}

export function ActivityLogAvatar({
  actor,
  size = "md",
  className,
}: ActivityLogAvatarProps) {
  const cfg = getActorConfig(actor.type);
  const dim = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";

  if (actor.avatar) {
    return (
      <img
        src={actor.avatar}
        alt={actor.name}
        className={cn(
          "rounded-full object-cover ring-1 ring-border",
          dim,
          className,
        )}
      />
    );
  }

  const isNamedUser = actor.type === "user" && actor.name;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ring-border",
        cfg.bg,
        cfg.text,
        dim,
        className,
      )}
      title={`${actor.name} (${cfg.label})`}
    >
      {isNamedUser ? (
        "kc"
      ) : (
        <i
          className={cn(
            cfg.icon,
            size === "sm" ? "text-[10px]" : "text-[12px]",
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
