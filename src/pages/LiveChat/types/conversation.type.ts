import { z } from "zod";
import { IdentifiersSchema, PlatformSchema } from "./share.type";

export const ConversationTagSchema = z.object({
  label: z.string(),
  color: z.string().optional(),
});

export const ConversationFollowUpSchema = z.object({
  id: z.string().optional(),
  note: z.string().optional(),
  dueAt: z.any().nullable().optional(),
  completedAt: z.any().nullable().optional(),
  createdAt: z.any().optional(),
});

export const ConversationStatusSchema = z.string().min(1);

export const MessageFromSchema = z.enum(["me", "bot", "user", "system"]);

export const LastMessageSchema = z.object({
  messageId: z.string().nullable().optional(),
  text: z.string().nullable().optional(),
  type: z.string().default("text"),
  from: MessageFromSchema.default("user"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const ConversationSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  visitorId: z.string(),
  platform: PlatformSchema,
  identifiers: IdentifiersSchema,
  status: ConversationStatusSchema.default("open"),
  lastMessage: LastMessageSchema.optional(),
  customerWindowExpiresAt: z.date().optional(),
  searchPreview: z.string().nullable().optional(),
  matchedMessageId: z.string().nullable().optional(),
  contact: z
    .object({
      name: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      phoneNumber: z.string().nullable().optional(),
      profilePicture: z.string().nullable().optional(),
    })
    .optional(),
  unreadCount: z.number().default(0),
  tags: z.array(ConversationTagSchema).default([]),
  score: z.number().default(0),
  scoreLevel: z.string().optional(),
  inboundCount: z.number().default(0),
  outboundCount: z.number().default(0),
  followUps: z.array(ConversationFollowUpSchema).default([]),
  totalMessages: z.number().default(0),
  isBlocked: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  metadata: z.record(z.any(), z.any()).default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TConversationStatus = z.infer<typeof ConversationStatusSchema>;
export type TConversationTag = z.infer<typeof ConversationTagSchema>;
export type TConversationFollowUp = z.infer<typeof ConversationFollowUpSchema>;

export type TMessageFrom = z.infer<typeof MessageFromSchema>;

export type TLastMessage = z.infer<typeof LastMessageSchema>;

export type TConversation = z.infer<typeof ConversationSchema>;
