import { BUTTON_HEADER_CONFIG } from "@/components/chatFlowEditior/config";

export const CANNED_MEDIA_ACCEPT: Record<
  "image" | "video" | "document" | "audio",
  { accept: string; maxSize: number; acceptLabels: string }
> = {
  image: {
    accept: BUTTON_HEADER_CONFIG.image.accept,
    maxSize: BUTTON_HEADER_CONFIG.image.maxSize,
    acceptLabels: BUTTON_HEADER_CONFIG.image.acceptLabels,
  },
  video: {
    accept: "video/mp4,video/3gpp,video/webm",
    maxSize: 16 * 1024 * 1024,
    acceptLabels: "mp4, 3gp, webm",
  },
  document: {
    accept:
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
    maxSize: 100 * 1024 * 1024,
    acceptLabels: "pdf, doc, docx, xls, xlsx, ppt, pptx, txt",
  },
  audio: {
    accept: "audio/mpeg,audio/mp4,audio/aac,audio/ogg,audio/wav,audio/amr",
    maxSize: 16 * 1024 * 1024,
    acceptLabels: "mp3, aac, ogg, wav",
  },
};
