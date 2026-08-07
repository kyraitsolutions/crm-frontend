export const WHATSAPP_MEDIA = {
  limits: {
    image: 5 * 1024 * 1024,
    video: 16 * 1024 * 1024,
    audio: 16 * 1024 * 1024,
    document: 5 * 1024 * 1024,
  },

  mimeTypes: {
    image: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    video: ["video/mp4"],
    audio: ["audio/mpeg", "audio/mp3", "audio/ogg", "audio/aac", "audio/webm"],
    document: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
};
