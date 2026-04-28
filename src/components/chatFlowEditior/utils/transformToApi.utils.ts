import type {
  TButtonNodeDataPayload,
  TFooter,
  THeader,
  TListNodeDataPayload,
} from "../types/types";

export const transformToApi = (
  data: TButtonNodeDataPayload | TListNodeDataPayload,
) => {
  switch (data?.interactive?.type) {
    case "button":
      return transformButton(data as TButtonNodeDataPayload);

    case "list":
      return transformList(data as TListNodeDataPayload);

    // case "carousel":
    //   return transformCarousel(data);

    default:
      throw new Error("Unsupported interactive type");
  }
};

const transformList = (data: TListNodeDataPayload) => {
  const header = buildHeader(data?.interactive?.header);
  const footer = buildFooter(data?.interactive?.footer);
  return {
    type: "interactive",
    interactive: {
      type: "list",
      ...(header && { header }),
      body: data?.interactive?.body,
      ...(footer && { footer }),
      action: data?.interactive?.action,
    },
  };
};

const transformButton = (data: TButtonNodeDataPayload) => {
  const header = buildHeader(data?.interactive?.header);
  const footer = buildFooter(data?.interactive?.footer);

  return {
    type: "interactive",
    interactive: {
      type: "button",
      ...(header && { header }),
      body: data?.interactive?.body,
      ...(footer && { footer }),
      action: data?.interactive?.action,
    },
  };
};

const buildHeader = (header: THeader) => {
  // no header selected
  if (!header.type) return undefined;

  // ✅ TEXT header
  if (header?.type === "text") {
    if (!header?.text?.trim()) return undefined;

    return {
      type: "text",
      text: header?.text?.trim(),
    };
  }

  // ✅ IMAGE header
  else if (header?.type === "image") {
    if (!header?.image && !header?.image?.link) return undefined;

    return {
      type: "image",
      image: {
        link: header?.image?.link, // WhatsApp uses "link"
      },
    };
  }
  // ✅ VIDEO header
  else if (header?.type === "video") {
    if (!header?.video?.link) return undefined;

    return {
      type: "video",
      video: {
        link: header?.video?.link, // WhatsApp uses "link"
      },
    };
  }
  // DOCUMENT header
  else if (header?.type === "document") {
    if (!header?.document?.link) return undefined;

    return {
      type: "document",
      document: {
        link: header?.document?.link, // WhatsApp uses "link"
      },
    };
  }

  return undefined;
};

const buildFooter = (footer: TFooter) => {
  // no footer selected
  if (!footer.text.trim()) return undefined;

  return {
    type: "text",
    text: footer.text.trim(),
  };
};
