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
