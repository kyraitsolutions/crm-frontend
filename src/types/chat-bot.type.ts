import type {
  TAppEdge,
  TAppNode,
} from "@/components/chatFlowEditior/types/types";
import type { LucideIcon } from "lucide-react";
import { z } from "zod";

export const knowledgeSchema = z.object({
  url: z.string().optional(),
  files: z.array(z.string()).optional(),
  rawText: z.string().optional(),
  type: z.number().nullable().optional(),
});

export type Knowledge = z.infer<typeof knowledgeSchema>;

export const chatBotConversationSchema = z.object({
  showWelcomeMessage: z.boolean().optional(),
  welcomeMessage: z.string().optional(),
  emailCapture: z.boolean().optional(),
  phoneNumberCapture: z.boolean().optional(),
  fallbackResponse: z.string().optional(),
});

export type ChatBotConversation = z.infer<typeof chatBotConversationSchema>;

export const chatBotSuggestionSchema = z.array(z.string()).optional();

export type ChatBotSuggestions = z.infer<typeof chatBotSuggestionSchema>;

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color");

export const appearanceSchema = z.object({
  brandColor: hexColorSchema.default("#3b5d50"),

  contrastColor: hexColorSchema.default("#fefefe"),

  backgroundColor: hexColorSchema.default("#ffffff"),

  messageColor: hexColorSchema.default("#f1f5f9"),

  userMessageColor: hexColorSchema.default("#3b5d50"),

  typeface: z.string().min(1).default("Inter"),

  fontSize: z.number().min(10).max(30).default(14),

  fontWeight: z
    .enum(["thin", "light", "normal", "medium", "bold"])
    .default("normal"),

  avatarStyle: z.enum(["bubble", "square", "round"]).default("bubble"),

  avatarUrl: z.string().url().nullable().or(z.literal("")).default(""),

  showAvatar: z.boolean().default(true),

  roundedCorners: z.boolean().default(true),

  borderWidth: z.number().min(0).max(10).default(1),

  borderColor: hexColorSchema.default("#e2e8f0"),

  widgetPosition: z
    .enum(["bottom-right", "bottom-left", "top-right", "top-left"])
    .default("bottom-right"),

  showLauncher: z.boolean().default(true),

  launcherLabel: z.string().max(120).default("Need product guidance?"),

  launcherSize: z.number().min(24).max(200).default(56),

  messageAlignment: z.enum(["left", "center", "right"]).default("left"),

  showTimestamps: z.boolean().default(true),

  animationStyle: z.enum(["slide", "fade", "none"]).default("slide"),

  shadowIntensity: z.number().min(0).max(100).default(20),

  opacity: z.number().min(0).max(100).default(100),

  customCSS: z.string().max(2000).default(""),
});

export type AppearanceState = z.infer<typeof appearanceSchema>;

export const appearanceFieldSchema = z.object({
  key: z.string(),
  label: z.string(),

  type: z.enum(["color", "select", "slider", "text", "textarea"]),

  options: z.array(z.string()).optional(),

  min: z.number().optional(),

  max: z.number().optional(),

  step: z.number().optional(),
});

export type AppearanceField = z.infer<typeof appearanceFieldSchema>;

export const chatbotAppearanceSectionSchema = z.object({
  title: z.string(),

  description: z.string(),

  // LucideIcon cannot be validated by Zod
  icon: z.custom<LucideIcon>(),

  fields: z.array(appearanceFieldSchema),
});

export type ChatbotAppearanceSection = z.infer<
  typeof chatbotAppearanceSectionSchema
>;

export const chatBotConfigSchema = z.object({
  enableWidgetMessage: z.boolean().default(true),

  language: z.enum(["english", "hindi"]).default("english"),

  enableRantingAndFeedback: z.boolean().default(true),

  ratingAndFeedback: z
    .object({
      rating: z.number().int().min(1).max(5).default(5),
      feedback: z.string().default(""),
    })
    .default({
      rating: 5,
      feedback: "",
    }),

  chat_transcript: z.boolean().default(true),

  enableVoiceNote: z.boolean().default(false),

  responseInterval: z
    .union([z.literal(0), z.literal(1), z.literal(2)])
    .default(0),

  initiateChatbot: z.enum(["immediate", "action"]).default("immediate"),

  showBranding: z.boolean().default(true),

  autoOpenAfterSeconds: z.number().nullable().default(null),

  brandLabelText: z.string().default(""),

  enableBrandLabel: z.boolean().default(true),

  showTypingIndicator: z.boolean().default(true),
});

export type ChatBotConfig = z.infer<typeof chatBotConfigSchema>;

export const chatBotSchema = z.object({
  id: z.string().optional(),

  name: z.string().min(3, "Name is required and must be at least 3 characters"),

  status: z.boolean().default(true),

  description: z.string().optional(),

  conversation: chatBotConversationSchema.default({}).optional(),

  suggestions: chatBotSuggestionSchema,

  theme: appearanceSchema,

  config: chatBotConfigSchema,
});

export type ChatBotFormData = z.infer<typeof chatBotSchema>;

export const createChatBotFlowSchema = z.object({
  nodes: z.custom<TAppNode[]>().optional(),
  edges: z.custom<TAppEdge[]>().optional(),
});

export type TCreateChatBotFlow = z.infer<typeof createChatBotFlowSchema>;

export const apiResponseChatFlowDtoSchema = z.object({
  id: z.string(),

  name: z.string(),

  nodes: z.custom<TAppNode[]>(),

  edges: z.custom<TAppEdge[]>(),
});

export type ApiResponseChatFlowDto = z.infer<
  typeof apiResponseChatFlowDtoSchema
>;

export const chatbotListItemSchema = z.object({
  id: z.string(),

  name: z.string(),

  description: z.string(),

  status: z.boolean(),

  flowId: z.string(),

  createdAt: z.string(),

  updatedAt: z.string(),
});

export type ChatbotListItem = z.infer<typeof chatbotListItemSchema>;

// import type {
//   TAppEdge,
//   TAppNode,
// } from "@/components/chatFlowEditior/types/types";
// import type { LucideIcon } from "lucide-react";
// import z from "zod";

// export const knowledgeSchema = z.object({
//   url: z.string().optional(),
//   files: z.array(z.string()).optional(),
//   rawText: z.string().optional(),
//   type: z.number().nullable().optional(),
// });

// export const chatBotConversationSchema = z.object({
//   showWelcomeMessage: z.boolean().optional(),
//   welcomeMessage: z.string().optional(),
//   emailCapture: z.boolean().optional(),
//   phoneNumberCapture: z.boolean().optional(),
//   fallbackResponse: z.string().optional(),
// });

// export const chatBotSuggestionSchema = z.array(z.string()).optional();

// export const appearanceSchema = z.object({
//   brandColor: z
//     .string()
//     .trim()
//     .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color")
//     .default("#3b5d50"),
//   contrastColor: z
//     .string()
//     .trim()
//     .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color")
//     .default("#fefefe"),
//   backgroundColor: z
//     .string()
//     .trim()
//     .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color")
//     .default("#ffffff"),
//   messageColor: z
//     .string()
//     .trim()
//     .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color")
//     .default("#f1f5f9"),
//   userMessageColor: z
//     .string()
//     .trim()
//     .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color")
//     .default("#3b5d50"),
//   typeface: z.string().min(1).default("Inter"),
//   fontSize: z.number().min(10).max(30).default(14),
//   fontWeight: z
//     .enum(["thin", "light", "normal", "medium", "bold"])
//     .default("normal"),
//   avatarStyle: z.enum(["bubble", "square", "round"]).default("bubble"),
//   avatarUrl: z.string().url().nullable().or(z.literal("")).default(""),
//   showAvatar: z.boolean().default(true),
//   roundedCorners: z.boolean().default(true),
//   borderWidth: z.number().min(0).max(10).default(1),
//   borderColor: z
//     .string()
//     .trim()
//     .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color")
//     .default("#e2e8f0"),
//   widgetPosition: z
//     .enum(["bottom-right", "bottom-left", "top-right", "top-left"])
//     .default("bottom-right"),
//   showLauncher: z.boolean().default(true),
//   launcherLabel: z.string().max(120).default("Need product guidance?"),
//   launcherSize: z.number().min(24).max(200).default(56),
//   messageAlignment: z.enum(["left", "center", "right"]).default("left"),
//   showTimestamps: z.boolean().default(true),
//   animationStyle: z.enum(["slide", "fade", "none"]).default("slide"),
//   shadowIntensity: z.number().min(0).max(100).default(20),
//   opacity: z.number().min(0).max(100).default(100),
//   customCSS: z.string().max(2000).optional().default(""),
// });

// export const chatBotConfigSchema = z.object({
//   enableWidgetMessage: z.boolean().default(true),
//   language: z.enum(["english", "hindi"]).default("english"),
//   enableRantingAndFeedback: z.boolean().default(true),
//   ratingAndFeedback: z
//     .object({
//       rating: z.number().int().min(1).max(5).default(5),
//       feedback: z.string().default(""),
//     })
//     .default({ rating: 5, feedback: "" }),

//   chat_transcript: z.boolean().default(true),
//   enableVoiceNote: z.boolean().default(false),
//   responseInterval: z
//     .union([z.literal(0), z.literal(1), z.literal(2)])
//     .default(0),
//   initiateChatbot: z.enum(["immediate", "action"]).default("immediate"),
//   showBranding: z.boolean().default(true),
//   autoOpenAfterSeconds: z.number().nullable().default(null),
//   brandLabelText: z.string().default(""),
//   enableBrandLabel: z.boolean().default(true),
//   showTypingIndicator: z.boolean().default(true),
// });

// export const chatBotSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(3, "Name is required and must be at least 3 characters"),
//   status: z.boolean().default(true),
//   description: z.string().optional(),
//   conversation: chatBotConversationSchema.default({}).optional(),
//   suggestions: chatBotSuggestionSchema,
//   theme: appearanceSchema,
//   config: chatBotConfigSchema,
// });

// export type ChatBotFormData = z.infer<typeof chatBotSchema>;

// export interface AppearanceState {
//   brandColor: string;
//   contrastColor: string;
//   backgroundColor: string;
//   messageColor: string;
//   userMessageColor: string;
//   typeface: string;
//   fontSize: number;
//   fontWeight: string;
//   avatarStyle: string;
//   avatarUrl: string;
//   showAvatar: string;
//   roundedCorners: string;
//   borderWidth: number;
//   borderColor: string;
//   widgetPosition: string;
//   showLauncher: string;
//   launcherLabel: string;
//   launcherSize: number;
//   messageAlignment: string;
//   showTimestamps: string;
//   animationStyle: string;
//   shadowIntensity: number;
//   opacity: number;
//   customCSS: string;
// }

// export interface AppearanceField {
//   key: string;
//   label: string;
//   type: "color" | "select" | "slider" | "text" | "textarea";
//   options?: string[];
//   min?: number;
//   max?: number;
//   step?: number;
// }

// export interface ChatbotAppearanceSection {
//   title: string;
//   description: string;
//   icon: LucideIcon;
//   fields: AppearanceField[];
// }

// export interface TCreateChatBotFlow {
//   nodes?: TAppNode[];
//   edges?: TAppEdge[];
// }

// export interface ApiResponseChatFlowDto {
//   id: string;
//   name: string;
//   nodes: TAppNode[];
//   edges: TAppEdge[];
// }

// export interface ChatbotListItem {
//   id: string;
//   name: string;
//   description: string;
//   status: boolean;
//   flowId: string;
//   createdAt: string;
//   updatedAt: string;
// }
