export type CannedMessageType =
  | "text"
  | "image"
  | "video"
  | "document"
  | "audio";

export type CannedMessageStatus = "DRAFT" | "PUBLISHED";

export type CannedMessageMedia = {
  url: string;
  key?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
} | null;

export type TCannedMessage = {
  id: string;
  name: string;
  shortcut: string;
  type: CannedMessageType;
  text: string;
  category?: string;
  status: CannedMessageStatus;
  favourite?: boolean;
  usageCount?: number;
  lastUsedAt?: string | null;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
  media?: CannedMessageMedia;
};

export type UpsertCannedMessagePayload = {
  name: string;
  shortcut?: string;
  type: CannedMessageType;
  text?: string;
  category?: string;
  status?: CannedMessageStatus;
  favourite?: boolean;
  media?: CannedMessageMedia;
};
