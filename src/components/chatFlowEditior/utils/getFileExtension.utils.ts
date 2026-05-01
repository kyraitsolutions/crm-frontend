// utils/file.ts
const MIME_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export const getFileExtensionFromMime = (mimeType: string): string => {
  if (!mimeType) return "";

  return MIME_TYPE_MAP[mimeType] || mimeType.split(".").pop() || "";
};
