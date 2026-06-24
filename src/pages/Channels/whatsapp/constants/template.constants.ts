import type { TemplateCategory } from "../types/template.type";

export const TEMPLATE_CATEGORIES: {
  label: string;
  value: TemplateCategory;
}[] = [
  {
    label: "Marketing",
    value: "Marketing",
  },
  {
    label: "Utility",
    value: "Utility",
  },
  {
    label: "Authentication",
    value: "Authentication",
  },
];

export const TEMPLATE_LANGUAGES = [
  {
    label: "English (US)",
    value: "en_US",
  },
];

export const VARIABLE_LIBRARY = [
  "customer_name",
  "customer_phone",
  "customer_email",
  "order_id",
  "order_date",
  "tracking_number",
  "amount",
  "delivery_address",
  "company_name",
];

export const TEMPLATE_TYPES = {
  MARKETING: ["Promotion", "Announcement", "Offer", "Campaign"],

  UTILITY: [
    "Order Update",
    "Payment Update",
    "Appointment Reminder",
    "Account Alert",
  ],

  AUTHENTICATION: ["OTP Verification"],
};
