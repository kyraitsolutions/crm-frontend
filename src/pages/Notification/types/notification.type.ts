import { z } from "zod";

export const NotificationIdentifiersSchema = z.object({
  chatbotId: z.string(),
});

export const NotificationMetaSchema = z.object({
  accountId: z.string(),
  platform: z.string(),
  visitorId: z.string(),
  identifiers: NotificationIdentifiersSchema,
});

export const NotificationSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  image: z.string().optional(),
  type: z.string(),
  typeId: z.string().optional().nullable(),
  channelType: z.string(),
  description: z.string(),
  isPriority: z.boolean(),
  isRead: z.boolean(),
  meta: NotificationMetaSchema,
  title: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const NotificationsSchema = z.array(NotificationSchema);

export type TNotification = z.infer<typeof NotificationSchema>;

export type TNotificationMeta = z.infer<typeof NotificationMetaSchema>;

export type TNotificationIdentifiers = z.infer<
  typeof NotificationIdentifiersSchema
>;
