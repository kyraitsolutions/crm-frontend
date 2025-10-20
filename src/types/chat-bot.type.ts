import type { LucideIcon } from "lucide-react";
import z from "zod";

export const knowledgeSchema = z.object({
  url: z.string().optional(),
  files: z.array(z.string()).optional(),
  rawText: z.string().optional(),
  type: z.number().nullable().optional(),
});

export const chatBotConversationSchema = z.object({
  showWelcomeMessage: z.boolean().optional(),
  welcomeMessage: z.string().optional(),
  emailCapture: z.boolean().optional(),
  phoneNumberCapture: z.boolean().optional(),
  fallbackResponse: z.string().optional(),
});

export const chatBotSuggestionSchema = z.array(z.string()).optional();

export const chatBotSchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters"),
  description: z.string().optional(),
  knowledgeBase: knowledgeSchema,
  suggestions: chatBotSuggestionSchema,
  conversation: chatBotConversationSchema,
  theme: z.record(z.string(), z.any()).optional(),
});

export type ChatBotFormData = z.infer<typeof chatBotSchema>;

export interface AppearanceState {
  brandColor: string;
  contrastColor: string;
  backgroundColor: string;
  messageColor: string;
  userMessageColor: string;
  typeface: string;
  fontSize: number;
  fontWeight: string;
  avatarStyle: string;
  avatarUrl: string;
  showAvatar: string;
  roundedCorners: string;
  borderWidth: number;
  borderColor: string;
  widgetPosition: string;
  showLauncher: string;
  launcherLabel: string;
  launcherSize: number;
  messageAlignment: string;
  showTimestamps: string;
  animationStyle: string;
  shadowIntensity: number;
  opacity: number;
  customCSS: string;
}

export interface AppearanceField {
  key: string;
  label: string;
  type: "color" | "select" | "slider" | "text" | "textarea";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ChatbotAppearanceSection {
  title: string;
  description: string;
  icon: LucideIcon;
  fields: AppearanceField[];
}

export interface ChatBotListItem {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
