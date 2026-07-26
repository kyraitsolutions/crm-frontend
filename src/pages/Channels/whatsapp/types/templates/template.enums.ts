export const TEMPLATE_CATEGORIES = [
  "Marketing",
  "Utility",
  "Authentication",
] as const;

export const TEMPLATE_TYPES = [
  "CUSTOM",
  "CATALOGUE",
  "CALLING_PERMISSIONS_REQUEST",
] as const;

export const HEADER_TYPES = [
  "Text",
  "Image",
  "Video",
  "Document",
  "Location",
] as const;

export const VARIABLE_TYPES = ["Name", "Number"] as const;

export const BUTTON_KINDS = [
  "QUICK_REPLY",
  "URL",
  "PHONE_NUMBER",
  "CALL_ON_WHATSAPP",
  "COPY_CODE",
  "SHARE_CONTACT",
] as const;

export const URL_TYPES = ["STATIC", "DYNAMIC"] as const;

export const WHATSAPP_ACTIVE_FOR = ["7_DAYS", "30_DAYS", "90_DAYS"] as const;

export const TEMPLATE_STATUS = [
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "PAUSED",
  "DISABLED",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];
export type TemplateType = (typeof TEMPLATE_TYPES)[number];
export type HeaderType = (typeof HEADER_TYPES)[number];
export type VariableType = (typeof VARIABLE_TYPES)[number];
export type ButtonKind = (typeof BUTTON_KINDS)[number];
export type UrlType = (typeof URL_TYPES)[number];
export type WhatsAppActiveFor = (typeof WHATSAPP_ACTIVE_FOR)[number];
export type TemplateStatus = (typeof TEMPLATE_STATUS)[number];
