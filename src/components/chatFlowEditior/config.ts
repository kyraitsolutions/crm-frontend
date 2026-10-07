import { FILE_LIMITS } from "@/constants";

export const NODE_LIBRARY = [
  {
    category: "Conversation",
    nodes: [
      { type: "send_message", label: "Send Message", keywords: "text image video document media" },
      { type: "question", label: "Ask Question", keywords: "question input email phone location address media file" },
      { type: "button", label: "Text Buttons", keywords: "buttons quick reply options" },
      { type: "button", label: "Media Buttons", keywords: "image video media buttons", preset: "media" },
      { type: "list", label: "List", keywords: "menu options" },
      { type: "template", label: "Template", keywords: "whatsapp approved" },
      { type: "carousel", label: "Carousel", keywords: "cards" },
      { type: "handoff", label: "Request Intervention", keywords: "human agent handoff" },
    ],
  },
  {
    category: "Logic & Navigation",
    nodes: [
      { type: "condition", label: "Condition", keywords: "if else branch" },
      { type: "keyword", label: "Keyword", keywords: "trigger match phrase" },
      { type: "delay", label: "Delay", keywords: "wait seconds minutes hours days" },
      { type: "goto", label: "Go To", keywords: "jump node" },
      // { type: "connect_flow", label: "Connect Flow", keywords: "another flow jump" },
      // { type: "end", label: "End Flow", keywords: "stop" },
    ],
  },
  {
    category: "Contact & Data",
    nodes: [
      { type: "set_attribute", label: "Set Attribute", keywords: "variable save" },
      { type: "add_tag", label: "Add Tag", keywords: "contact tag" },
      { type: "remove_tag", label: "Remove Tag", keywords: "contact tag" },
      // { type: "api_request", label: "API Request", keywords: "http webhook" },
    ],
  },
] as const;

export const BUTTON_MODES = ["url", "quick_reply"];
export const HEADER_MEDIA_TYPES = ["text", "image", "video", "document"];
export const CAROUSEL_HEADER_MEDIA_SUPPORT = ["image", "video"];

export const BUTTON_HEADER_CONFIG = {
  text: {
    isMedia: false,
    placeholder: "Enter header text",
  },
  image: {
    isMedia: true,
    accept: FILE_LIMITS.IMAGE.ACCEPTED_TYPES,
    acceptLabels: "png, jpg, jpeg",
    maxSize: FILE_LIMITS.IMAGE.MAX_SIZE_MB,
  },
  video: {
    isMedia: true,
    accept: FILE_LIMITS.VIDEO.ACCEPTED_TYPES,
    acceptLabels: "mp4, webm",
    maxSize: FILE_LIMITS.VIDEO.MAX_SIZE_MB,
  },
  document: {
    isMedia: true,
    accept: FILE_LIMITS.DOCUMENT.ACCEPTED_TYPES,
    acceptLabels: "pdf, doc, docx",
    maxSize: FILE_LIMITS.DOCUMENT.MAX_SIZE_MB,
  },
} as const;

// type HeaderType = keyof typeof HEADER_MEDIA_TYPES;
