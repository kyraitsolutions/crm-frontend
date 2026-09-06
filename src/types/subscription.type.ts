export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export interface SubscriptionPlanView {
  id: string;
  code: string;
  name: string;
  description?: string;
  featured?: boolean;
  currency?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  price?: { monthly: number; annually: number };
  button?: string;
  features?: string[];
  addons?: string[];
  featureMap?: Record<string, boolean>;
  limits?: SubscriptionLimits;
}

export interface SubscriptionLimits {
  teamMembers: number;
  accounts: number;
  chatbots: number;
  webhooks: number;
  leadsPerMonth: number;
  whatsappMessagesPerMonth: number;
  aiConversationsPerMonth: number;
  emailsPerMonth?: number;
  emailCampaignsPerMonth?: number;
  emailRecipientsPerCampaign?: number;
}

export interface SubscriptionUsage {
  teamMembers: number;
  accounts: number;
  chatbots: number;
  webhooks: number;
  leads: number;
  whatsappMessages: number;
  aiConversations: number;
  emails?: number;
  emailCampaigns?: number;
}

export interface OrganizationSubscriptionSnapshot {
  id: string;
  organizationId: string;
  plan: SubscriptionPlanView | null;
  status: SubscriptionStatus;
  isTrial: boolean;
  isActive: boolean;
  isExpired: boolean;
  trial: {
    trialStartAt: string | null;
    trialEndAt: string | null;
    daysRemaining: number;
  };
  billing: {
    interval: "monthly" | "yearly" | null;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
    razorpayKeyId?: string;
  };
  features: Record<string, boolean>;
  limits: SubscriptionLimits;
  usage: SubscriptionUsage;
  addons: { addonCode: string; status: string }[];
  expirationPrompt: {
    shouldShow: boolean;
    shownAt: string | null;
    dismissedAt: string | null;
  };
}

export interface SubscriptionPaymentRecord {
  id: string;
  planName?: string;
  planCode?: string;
  interval?: "monthly" | "yearly";
  amount: number;
  currency: string;
  status: "pending" | "captured" | "failed" | "refunded";
  method?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
}

export interface SubscriptionPaymentSummary {
  currency: string;
  totalRevenue: number;
  capturedCount: number;
  pendingCount: number;
  failedCount: number;
  thisMonthRevenue: number;
  thisMonthCount: number;
}
