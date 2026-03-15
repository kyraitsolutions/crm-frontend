export enum TemplateCategory {
  MARKETING = "marketing",
  TRANSACTIONAL = "transactional",
  FOLLOW_UP = "follow-up",
  NEWSLETTER = "newsletter",

  // CRM specific
  LEAD_RESPONSE = "lead-response",
  THANK_YOU = "thank-you",
  NOTIFICATION = "notification",
  ONBOARDING = "onboarding",
  REMINDER = "reminder",
}

export enum Method{
  USER="user",
  AI="ai"
}

export interface EmailTemplateData{
  name: string;
  subject: string;
  html: string;
  preheader?: string;
  variables?: string[];
  category?: TemplateCategory;
  generatedBy?:Method
};