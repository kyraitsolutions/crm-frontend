export const FILE_LIMITS = {
  IMAGE: {
    MAX_SIZE_MB: 5 * 1024 * 1024,
    ACCEPTED_TYPES: "image/jpeg,image/jpg,image/png",
  },
  VIDEO: {
    MAX_SIZE_MB: 20 * 1024 * 1024,
    ACCEPTED_TYPES: "video/mp4,video/webm",
  },
  DOCUMENT: {
    MAX_SIZE_MB: 2 * 1024 * 1024,
    ACCEPTED_TYPES:
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
};
