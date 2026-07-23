import { FileText, ImageIcon, Video } from "lucide-react";

export const HEADER_MEDIA_CONFIG = {
  Image: {
    accept: "image/png,image/jpeg",
    maxSize: 5 * 1024 * 1024,
    maxSizeLabel: "5 MB",
    supportedFormats: "JPG, PNG",
    icon: ImageIcon,
  },

  Video: {
    accept: "video/mp4,video/3gpp",
    maxSize: 16 * 1024 * 1024,
    maxSizeLabel: "16 MB",
    supportedFormats: "MP4, 3GP",
    icon: Video,
  },

  Document: {
    accept: ".pdf",
    maxSize: 100 * 1024 * 1024,
    maxSizeLabel: "100 MB",
    supportedFormats: "PDF",
    icon: FileText,
  },
} as const;
