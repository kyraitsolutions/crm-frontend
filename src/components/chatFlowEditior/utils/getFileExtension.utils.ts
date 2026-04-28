// utils/file.ts
const MIME_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",

  "video/mp4": "mp4",
  "video/webm": "webm",

  "application/pdf": "pdf",
};

export const getFileExtensionFromMime = (mimeType: string): string => {
  if (!mimeType) return "";

  return MIME_TYPE_MAP[mimeType] || mimeType.split("/")[1] || "";
};
