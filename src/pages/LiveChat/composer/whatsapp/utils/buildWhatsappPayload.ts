export const buildWhatsappPayload = (to: string, outgoing: any) => {
  switch (outgoing.type) {
    case "text":
      return {
        to,
        type: "text",
        text: {
          body: outgoing.payload.text,
        },
      };

    case "media": {
      const mediaBody = outgoing.payload.link
        ? {
            link: outgoing.payload.link,
            caption: outgoing.payload.caption,
            filename: outgoing.payload.fileName,
            mimeType: outgoing.payload.mimeType,
            size: outgoing.payload.size,
          }
        : {
            file: outgoing.payload.file,
            caption: outgoing.payload.caption,
            filename: outgoing.payload.fileName,
          };

      switch (outgoing.payload.attachmentType) {
        case "image":
          return {
            to,
            type: "image",
            image: mediaBody,
          };

        case "video":
          return {
            to,
            type: "video",
            video: mediaBody,
          };

        case "document":
          return {
            to,
            type: "document",
            document: mediaBody,
          };

        case "audio":
          return {
            to,
            type: "audio",
            audio: mediaBody,
          };
      }
      break;
    }

    case "template":
      return {
        to,
        type: "template",
        template: {
          name: outgoing.payload.templateId,
          language: {
            code: outgoing.payload.language,
          },
          components: outgoing.payload.parameters ?? [],
        },
      };

    default:
      return null;
  }
};
