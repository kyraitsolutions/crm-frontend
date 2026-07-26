export interface DaySchedule {
  day: string;
  enabled: boolean;
  from: string;
  to: string;
}

export const defaultSchedule: DaySchedule[] = [
  { day: "Mon", enabled: true, from: "09:00 AM", to: "06:00 PM" },
  { day: "Tue", enabled: false, from: "09:00 AM", to: "06:00 PM" },
  { day: "Wed", enabled: false, from: "09:00 AM", to: "06:00 PM" },
  { day: "Thu", enabled: false, from: "09:00 AM", to: "06:00 PM" },
  { day: "Fri", enabled: false, from: "09:00 AM", to: "06:00 PM" },
  { day: "Sat", enabled: false, from: "09:00 AM", to: "06:00 PM" },
  { day: "Sun", enabled: false, from: "09:00 AM", to: "06:00 PM" },
];