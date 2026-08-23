import type { TOutgoingMessage } from "./buildOutgoingMessage";

export const getMessageType = (outgoing: TOutgoingMessage) => {
  if (outgoing.type === "media") {
    return outgoing.payload.attachmentType;
  }

  return outgoing.type;
};
