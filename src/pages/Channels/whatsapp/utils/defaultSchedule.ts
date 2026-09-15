export interface DaySchedule {
  day: string;
  enabled: boolean;
  from: string;
  to: string;
}

export const defaultSchedule: DaySchedule[] = [
  { day: "Mon", enabled: true, from: "09:00", to: "18:00" },
  { day: "Tue", enabled: true, from: "09:00", to: "18:00" },
  { day: "Wed", enabled: true, from: "09:00", to: "18:00" },
  { day: "Thu", enabled: true, from: "09:00", to: "18:00" },
  { day: "Fri", enabled: true, from: "09:00", to: "18:00" },
  { day: "Sat", enabled: false, from: "09:00", to: "18:00" },
  { day: "Sun", enabled: false, from: "09:00", to: "18:00" },
];

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "America/New_York", label: "America/New York" },
  { value: "America/Los_Angeles", label: "America/Los Angeles" },
  { value: "UTC", label: "UTC" },
];
