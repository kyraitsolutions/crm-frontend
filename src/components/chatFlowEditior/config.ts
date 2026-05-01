import { FILE_LIMITS } from "@/constants";

export const NODE_LIBRARY = [
  { type: "send_message", label: "Send Message" },
  { type: "list", label: "List" },
  { type: "button", label: "Buttons" },
  { type: "carousel", label: "Carousel" },
  { type: "question", label: "Questions?" },
  { type: "phone", label: "Phone" },
  // { type: "end", label: "End Chat" },
];

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
