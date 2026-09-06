export type EmailCampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "QUEUED"
  | "SENDING"
  | "COMPLETED"
  | "PAUSED"
  | "CANCELED"
  | "FAILED";

export type EmailCampaign = {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
  html: string;
  status: EmailCampaignStatus;
  audience?: {
    mode: "contacts" | "filters" | "all";
    contactIds?: string[];
    filters: Record<string, unknown>;
  };
  scheduledAt?: string;
  timezone?: string;
  audienceCount?: number;
  eligibleCount?: number;
  excludedCount?: number;
  totalRecipients?: number;
  sentCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  clickedCount?: number;
  bouncedCount?: number;
  unsubscribedCount?: number;
  failedCount?: number;
  rates?: {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribeRate: number;
    clickToOpenRate: number;
  };
  createdAt?: string;
};

export type EmailTemplate = {
  id?: string;
  _id?: string;
  name: string;
  subject: string;
  html: string;
  preheader?: string;
  category?: string;
  status?: string;
};

export type EmailRecipient = {
  id: string;
  email: string;
  name?: string;
  status: string;
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
  contactId?: string;
  leadId?: string;
};
