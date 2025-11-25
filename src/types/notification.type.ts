import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean().default(false),
  createdAt: z.date(),
});

export type INotification = z.infer<typeof NotificationSchema>;
