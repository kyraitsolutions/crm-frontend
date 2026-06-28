import type { BadgeStyle, ConfigBase } from "./activity-log.type";

export type ActorType = "user" | "automation" | "system" | "api";

export interface ActorConfig extends ConfigBase {
  badge: BadgeStyle;
}

// import type { LucideIcon } from "lucide-react";
// import type { BadgeStyle } from "./activity-log.type";

// export type ActorType = "user" | "automation" | "system" | "api";

// export interface ActorConfig {
//   label: string;
//   badge: BadgeStyle;
//   icon: LucideIcon;
// }
