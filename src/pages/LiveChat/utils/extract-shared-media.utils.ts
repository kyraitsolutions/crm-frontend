import type { TMessage } from "../types/message.type";

export const extractSharedMedia = (messages: TMessage[]) => {
  const media: any[] = [];

  messages.forEach((message) => {
    /*
      NORMAL IMAGE MESSAGE
    */
    if (message.type === "image") {
      media.push({
        type: "image",
        url: message.media?.image?.link,
        messageId: message.messageId,
        createdAt: message.createdAt,
      });
    }
    /*
      NORMAL VIDEO MESSAGE
    */
    if (message.type === "video") {
      media.push({
        type: "video",
        url: message.media?.video?.link,
        messageId: message.messageId,
        createdAt: message.createdAt,
      });
    }

    /*
      NORMAL DOCUMENT MESSAGE
    */
    if (message.type === "document") {
      media.push({
        type: "document",
        url: message.media?.document?.link,
        messageId: message.messageId,
        createdAt: message.createdAt,
      });
    }

    /*
      INTERACTIVE HEADER MEDIA
    */
    if (message.type === "interactive") {
      const header =
        message.interactive?.type === "button"
          ? message.interactive?.header
          : message?.interactive?.type === "list"
            ? message.interactive?.header
            : null;

      if (header?.type === "image") {
        media.push({
          type: "image",
          url: header.image?.link,
          messageId: message.messageId,
          createdAt: message.createdAt,
        });
      }

      if (header?.type === "video") {
        media.push({
          type: "video",
          url: header.video?.link,
          messageId: message.messageId,
          createdAt: message.createdAt,
        });
      }

      if (header?.type === "document") {
        media.push({
          type: "document",
          url: header.document?.link,
          messageId: message.messageId,
          createdAt: message.createdAt,
        });
      }
    }
  });

  return media;
};
