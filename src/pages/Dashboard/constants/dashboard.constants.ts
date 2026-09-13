import { endOfDay, startOfDay, subDays, subYears } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { RangeOption } from "../types/dashboard.type";

export const MODULE_OPTIONS = [
  {
    label: "Overview",
    value: "overview",
  },

  {
    label: "Leads",
    value: "leads",
  },

  {
    label: "WhatsApp",
    value: "whatsapp",
  },

  {
    label: "Broadcasts",
    value: "broadcasts",
  },
];

export const DATE_RANGE_OPTIONS: {
  label: string;
  value: RangeOption;
}[] = [
  {
    label: "Today",
    value: "today",
  },

  {
    label: "Yesterday",
    value: "yesterday",
  },

  {
    label: "Last 7 Days",
    value: "7days",
  },

  {
    label: "Last 30 Days",
    value: "30days",
  },

  {
    label: "Last Year",
    value: "1year",
  },

  {
    label: "Custom Range",
    value: "custom",
  },
];

export const DASHBOARD_DATE_PRESETS: {
  label: string;
  value: RangeOption;
  getValue: () => DateRange;
}[] = [
  {
    label: "Today",
    value: "today",
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Yesterday",
    value: "yesterday",
    getValue: () => {
      const day = subDays(new Date(), 1);
      return { from: startOfDay(day), to: endOfDay(day) };
    },
  },
  {
    label: "Last 7 Days",
    value: "7days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 Days",
    value: "30days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last Year",
    value: "1year",
    getValue: () => ({
      from: startOfDay(subYears(new Date(), 1)),
      to: endOfDay(new Date()),
    }),
  },
];
