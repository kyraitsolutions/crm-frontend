// import type { TMessage } from "@/pages/LiveChat/types/message.type";
import type { TMessage } from "@/pages/LiveChat/types/message.type";
import type { TOutgoingMessage } from "./buildOutgoingMessage";
import { getMessageType } from "./getMessageType";

type BuildOptimisticMessageProps = {
  accountId: string;
  conversationId: string;
  clientMessageId: string;
  outgoing: TOutgoingMessage;
};

export const buildOptimisticMessage = ({
  accountId,
  conversationId,
  clientMessageId,
  outgoing,
}: BuildOptimisticMessageProps) => {
  const base: Partial<TMessage> = {
    messageId: `${clientMessageId}`,
    clientMessageId,

    conversationId,
    accountId,

    from: "agent",

    type: getMessageType(outgoing) as any,

    platform: "whatsapp" as const,
    direction: "outbound" as const,

    status: "sent",
    createdAt: new Date(),
    updateAt: new Date(),
  };

  switch (outgoing.type) {
    case "text":
      return {
        ...base,
        body: {
          text: outgoing.payload.text,
        },
      };

    case "media":
      switch (outgoing.payload.attachmentType) {
        case "image":
          return {
            ...base,

            media: {
              type: "image",

              image: {
                link: URL.createObjectURL(outgoing.payload.file),
                caption: outgoing.payload.caption,
                mimetype: outgoing.payload.file.type,
                size: outgoing.payload.file.size,
              },
            },
          };

        case "video":
          return {
            ...base,

            media: {
              type: "video",

              video: {
                link: URL.createObjectURL(outgoing.payload.file),
                mimetype: outgoing.payload.file.type,
                size: outgoing.payload.file.size,
              },
            },
          };

        case "audio":
          return {
            ...base,

            media: {
              type: "audio",
              audio: {
                link: URL.createObjectURL(outgoing.payload.file),
                mimetype: outgoing.payload.file.type,
                size: outgoing.payload.file.size,
              },
            },
          };

        case "document":
          return {
            ...base,
            media: {
              type: "document",
              document: {
                link: URL.createObjectURL(outgoing.payload.file),
                mimetype: outgoing.payload.file.type,
                size: outgoing.payload.file.size,
                // filename: outgoing.payload.file.ty,
              },
            },
          };
      }
  }
};
