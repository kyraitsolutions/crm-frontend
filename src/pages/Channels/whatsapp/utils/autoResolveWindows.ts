import type { AutoResolveConfig, AutoResolveSchedule } from "../types/live-chat.type";

export const autoResolveCoversWelcome = (autoResolve?: AutoResolveConfig | null) =>
  Boolean(autoResolve?.enabled) &&
  (autoResolve?.scheduleMode === "always" ||
    autoResolve?.scheduleMode === "working_hours" ||
    !autoResolve?.scheduleMode);

export const autoResolveCoversOffHours = (autoResolve?: AutoResolveConfig | null) =>
  Boolean(autoResolve?.enabled) &&
  (autoResolve?.scheduleMode === "always" || autoResolve?.scheduleMode === "off_hours");

export const autoResolveResolverLabel = (mode?: AutoResolveConfig["mode"]) => {
  if (mode === "ai_agent") return "AI agent";
  if (mode === "flow") return "chatflow";
  return "auto resolve";
};

export const autoResolveScheduleCopy = (scheduleMode?: AutoResolveSchedule) => {
  if (scheduleMode === "always") {
    return "Runs always. Welcome and off-hours messages stay off because the resolver replies instead.";
  }
  if (scheduleMode === "off_hours") {
    return "Runs outside working hours. Off-hours messages stay off. Welcome / working-hours quick response stays available.";
  }
  return "Runs during working hours. Welcome messages stay off. Off-hours quick response stays available.";
};

export const welcomeLockReason = (autoResolve?: AutoResolveConfig | null) => {
  if (!autoResolveCoversWelcome(autoResolve)) return "";
  const resolver = autoResolveResolverLabel(autoResolve?.mode);
  if (autoResolve?.scheduleMode === "always") {
    return `${resolver} is set to always. Welcome message and templates are disabled because it is already replying.`;
  }
  return `${resolver} is handling working hours. Welcome message and templates are disabled for that window.`;
};

export const offHoursLockReason = (autoResolve?: AutoResolveConfig | null) => {
  if (!autoResolveCoversOffHours(autoResolve)) return "";
  const resolver = autoResolveResolverLabel(autoResolve?.mode);
  if (autoResolve?.scheduleMode === "always") {
    return `${resolver} is set to always. Off-hours message and templates are disabled because it is already replying.`;
  }
  return `${resolver} is handling non-working hours. Off-hours message and templates are disabled for that window.`;
};
