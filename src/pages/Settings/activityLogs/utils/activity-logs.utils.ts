import { Bot, UserPlus, Pencil, Workflow } from "lucide-react";
import type { ActivityLog } from "../types/activity-log.type";

export const getActivityIcon = (action: string) => {
  switch (action) {
    case "lead.created":
      return UserPlus;

    case "lead.updated":
      return Pencil;

    case "automation.created":
      return Workflow;

    default:
      return Bot;
  }
};

export const getActivityMessage = (log: ActivityLog) => {
  switch (log.action) {
    case "lead.created":
      return `${log.metadata?.leadName} was created`;

    case "lead.updated":
      return `${log.metadata?.leadName} was updated`;

    case "automation.created":
      return `Automation was created`;

    default:
      return log.action;
  }
};
