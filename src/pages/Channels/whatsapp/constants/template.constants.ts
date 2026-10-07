import type {
  ButtonKind,
  TemplateCategory,
  TemplateType,
  VariableType,
} from "../types/templates";
import type { ButtonTypeConfig } from "../types/templates/template.type";

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

export const TYPE_OPTIONS_BY_CATEGORY: Record<
  TemplateCategory,
  { value: TemplateType; title: string; description: string }[]
> = {
  Marketing: [
    {
      value: "CUSTOM",
      title: "Default",
      description:
        "Send messages with media and customised buttons to engage your customers.",
    },
    {
      value: "CAROUSEL",
      title: "Media card carousel",
      description:
        "Send a marketing message with 2–10 scrollable image or video cards. Each card can include optional body text and up to 2 buttons.",
    },
    // {
    //   value: "CALLING_PERMISSIONS_REQUEST",
    //   title: "Calling permissions request",
    //   description: "Ask customers if you can call them on WhatsApp.",
    // },
  ],
  Utility: [
    {
      value: "CUSTOM",
      title: "Default",
      description:
        "Send account updates, order confirmations, or alerts your customers expect.",
    },
    // {
    //   value: "CALLING_PERMISSIONS_REQUEST",
    //   title: "Calling permissions request",
    //   description: "Ask customers if you can call them on WhatsApp.",
    // },
  ],
  Authentication: [
    {
      value: "AUTHENTICATION",
      title: "One-time passcode",
      description:
        "Send a code so customers can verify an account or complete a login.",
    },
  ],
};

/** Auth copy-code only for now (one-tap / zero-tap need Android package + hash). */
export const AUTH_OTP_TYPES = [
  {
    value: "COPY_CODE",
    title: "Copy code",
    description:
      "Basic authentication with quick setup. Customers copy and paste the code into your app.",
    enabled: true,
  },
  {
    value: "ONE_TAP",
    title: "One-tap auto-fill",
    description:
      "Requires Android package name and signature hash. Not configured in Kyra yet.",
    enabled: false,
  },
  {
    value: "ZERO_TAP",
    title: "Zero-tap auto-fill",
    description:
      "Requires Android package name and signature hash. Not configured in Kyra yet.",
    enabled: false,
  },
] as const;

export const AUTH_CODE_EXPIRATION_MIN = 1;
export const AUTH_CODE_EXPIRATION_MAX = 90;
export const AUTH_VALIDITY_OPTIONS_MINUTES = [1, 3, 5, 10, 15, 30, 60] as const;

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

// Buttons
export const MAX_TEMPLATE_BUTTONS = 10;

export const BUTTON_LIMITS = {
  TOTAL: 10,
  LABEL_MAX: 25,
  URL_MAX: 2000,
  OFFER_CODE_MAX: 20,
  PHONE_MAX: 20,
} as const;

export const URL_TYPES = [
  {
    label: "Static",
    value: "STATIC",
  },
  {
    label: "Dynamic",
    value: "DYNAMIC",
  },
] as const;

export const BUTTON_TYPE_CONFIG: Record<ButtonKind, ButtonTypeConfig> = {
  QUICK_REPLY: {
    kind: "QUICK_REPLY",
    label: "Custom",
    description: "Quick reply button",
    maxCount: 10,
    fields: ["label"],
    editableLabel: true,
  },

  URL: {
    kind: "URL",
    label: "Visit website",
    description: "2 buttons maximum",
    maxCount: 2,
    fields: ["label", "urlType", "url", "trackConversions"],
    supportsTracking: true,
    urlTypes: ["STATIC", "DYNAMIC"],
    editableLabel: true,
  },

  PHONE_NUMBER: {
    kind: "PHONE_NUMBER",
    label: "Call Phone Number",
    description: "1 button maximum",
    maxCount: 1,
    fields: ["label", "countryCode", "phoneNumber"],
    editableLabel: true,
  },

  CALL_ON_WHATSAPP: {
    kind: "CALL_ON_WHATSAPP",
    label: "Call on WhatsApp",
    description: "1 button maximum",
    maxCount: 1,
    fields: ["label", "activeFor"],
    editableLabel: true,
  },

  COPY_CODE: {
    kind: "COPY_CODE",
    label: "Copy offer code",
    description: "1 button maximum",
    maxCount: 1,
    fields: ["label", "offerCode"],
    editableLabel: false,
  },

  SHARE_CONTACT: {
    kind: "SHARE_CONTACT",
    label: "Share contact info",
    description: "1 button maximum",
    maxCount: 1,
    fields: ["label"],
    editableLabel: false,
  },
};

// Variables
export const VARIABLE_TYPES: {
  label: string;
  value: VariableType;
  description: string;
}[] = [
  {
    label: "Name",
    value: "Name",
    description: "Use descriptive variable names such as customer_name.",
  },
  {
    label: "Number",
    value: "Number",
    description: "Use numbered placeholders like {{1}}, {{2}}.",
  },
];

/** Meta carousel cards: only these button kinds, max 2, same structure on every card. */
export const CAROUSEL_ALLOWED_BUTTON_KINDS: Extract<
  ButtonKind,
  "QUICK_REPLY" | "URL" | "PHONE_NUMBER"
>[] = ["QUICK_REPLY", "URL", "PHONE_NUMBER"];

export const CAROUSEL_MAX_BUTTONS = 2;
export const CAROUSEL_MIN_CARDS = 2;
export const CAROUSEL_MAX_CARDS = 10;
export const CAROUSEL_CARD_BODY_MAX = 160;
