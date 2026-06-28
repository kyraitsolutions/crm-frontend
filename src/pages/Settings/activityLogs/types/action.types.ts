import type {
  BadgeStyle,
  ConfigBase,
  TimelineStyle,
} from "./activity-log.type";

export interface ActionConfig extends ConfigBase {
  badge: BadgeStyle;
  timeline: TimelineStyle;
}
