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
      switch (outgoing.payload.attachmentType) {
        case "image":
          return {
            to,
            type: "image",
            image: {
              file: outgoing.payload.file,
              caption: outgoing.payload.caption,
            },
          };

        case "video":
          return {
            to,
            type: "video",
            video: {
              file: outgoing.payload.file,
              caption: outgoing.payload.caption,
            },
          };

        case "document":
          return {
            to,
            type: "document",
            document: {
              file: outgoing.payload.file,
            },
          };

        case "audio":
          return {
            to,
            type: "audio",
            audio: {
              file: outgoing.payload.file,
            },
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
