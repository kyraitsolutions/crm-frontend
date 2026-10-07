import { z } from "zod";
export type WhatsAppTab =
  | "overview"
  | "templates"
  | "broadcasts"
  | "automation"
  | "analytics"
  | "webhooks"
  | "settings";

export const WhatsAppBusinessInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const WhatsAppWabaInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  timezone: z.string(),
  marketingMessagesOnboardingStatus: z.string(),
});

export const WhatsAppPhoneNumberInfoSchema = z.object({
  id: z.string(),
  displayPhoneNumber: z.string(),
  verifiedName: z.string(),

  qualityRating: z.string().nullable(),

  messagingLimitTier: z.string().nullable(),

  accountMode: z.string().nullable(),

  platformType: z.string().nullable(),

  codeVerificationStatus: z.string().nullable(),

  nameStatus: z.string().nullable(),

  newNameStatus: z.string().nullable(),

  isOfficialBusinessAccount: z.boolean(),

  /** true = coexistence (WhatsApp Business App) signup — show Sync Contacts */
  isOnBizApp: z.boolean().optional().default(false),
});

export const WhatsAppBusinessProfileSchema = z.object({
  about: z.string().optional(),

  address: z.string().optional(),

  description: z.string().optional(),

  email: z.string().optional(),

  websites: z.array(z.string()).default([]),

  vertical: z.string(),

  profilePictureUrl: z.string().optional(),
});

export const WhatsAppAccountSchema = z.object({
  id: z.string(),
  integrationId: z.string(),
  businessInfo: WhatsAppBusinessInfoSchema,
  wabaInfo: WhatsAppWabaInfoSchema,
  phoneNumberInfo: WhatsAppPhoneNumberInfoSchema,
  profile: WhatsAppBusinessProfileSchema,
  connectedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isConnected: z.boolean(),
  onboardingCompleted: z.boolean(),
  webhookSubscribed: z.boolean(),
  lastProfileSyncAt: z.string().nullable(),
  /** ISO date — start of 24h SMB contact-sync window; null when disconnected */
  contactSyncWindowStartedAt: z.string().nullable().optional(),
  contactSync: z
    .object({
      status: z.enum([
        "NOT_REQUESTED",
        "REQUESTED",
        "NOT_SUPPORTED",
        "COMPLETED",
        "FAILED",
      ]),
      requestId: z.string().nullable().optional(),
      lastAttemptAt: z.string().nullable().optional(),
      lastErrorCode: z.number().nullable().optional(),
      lastErrorMessage: z.string().nullable().optional(),
    })
    .optional(),
});

export type TWhatsAppAccount = z.infer<typeof WhatsAppAccountSchema>;
