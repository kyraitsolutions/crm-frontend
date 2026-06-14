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
});

export type TWhatsAppAccount = z.infer<typeof WhatsAppAccountSchema>;
