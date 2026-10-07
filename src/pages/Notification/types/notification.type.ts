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
  channelType: z.string().optional(),
  description: z.string(),
  isPriority: z.boolean().optional(),
  isRead: z.boolean(),
  meta: NotificationMetaSchema.partial().optional(),
  title: z.string().optional(),
  eventKey: z.string().optional().nullable(),
  module: z.string().optional().nullable(),
  deepLink: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.string().optional().nullable(),
  unreadCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const NotificationsSchema = z.array(NotificationSchema);

export type TNotification = z.infer<typeof NotificationSchema>;

export type TNotificationMeta = z.infer<typeof NotificationMetaSchema>;

export type TNotificationIdentifiers = z.infer<
  typeof NotificationIdentifiersSchema
>;
