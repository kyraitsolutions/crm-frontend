import { z } from "zod";

export type MetaTab = "overview" | "settings";

export const FacebookPageSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  picture: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tasks: z.array(z.string()).optional(),
});

export const InstagramAccountSchema = z
  .object({
    id: z.string(),
    username: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    profilePictureUrl: z.string().nullable().optional(),
  })
  .nullable();

export const MetaAccountSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  integrationId: z.string(),
  facebookPage: FacebookPageSchema,
  instagram: InstagramAccountSchema.optional(),
  isConnected: z.boolean(),
  connectedAt: z.string().optional(),
  webhookSubscribed: z.boolean(),
  onboardingCompleted: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TFacebookPage = z.infer<typeof FacebookPageSchema>;
export type TInstagramAccount = z.infer<typeof InstagramAccountSchema>;
export type TMetaAccount = z.infer<typeof MetaAccountSchema>;
