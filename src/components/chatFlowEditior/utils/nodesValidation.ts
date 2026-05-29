import type { TButtonNodeData } from "../types/types";

export const validateSendMessageNode = (payload: any) => {
  for (let item = 0; item < payload.length; item++) {
    if (!payload[item].content) {
      return {
        message: `Send message node ${payload[item].type} content is required`,
        isValid: false,
      };
    } else if (payload[item].type === "image") {
      return {
        message: "Image is required",
        isValid: false,
      };
    } else if (payload[item].type === "video") {
      return {
        message: "Video is required",
        isValid: false,
      };
    } else if (payload[item].type === "document") {
      return {
        message: "Audio is required",
        isValid: false,
      };
    }
  }

  return null;
};

export const validateButtonNode = (
  payload: TButtonNodeData["payload"] | null,
) => {
  console.log(payload);
  if (!payload?.interactive?.body?.text) {
    return {
      message: `Button node body text is required`,
      isValid: false,
    };
  } else if ("parameters" in payload.interactive.action) {
    {
      if (!payload?.interactive?.action?.parameters?.display_text) {
        return {
          message: `Button node buttons text are required`,
          isValid: false,
        };
      }
      if (!payload?.interactive?.action?.parameters?.url) {
        return {
          message: `Button node buttons url are required`,
          isValid: false,
        };
      }
    }
  } else if ("buttons" in payload.interactive.action) {
    if (!payload?.interactive?.action?.buttons?.length) {
      return {
        message: `Button node buttons are required`,
        isValid: false,
      };
    }
    for (let i = 0; i < payload?.interactive?.action?.buttons?.length; i++) {
      const button = payload?.interactive?.action?.buttons[i];
      if (button?.type === "reply") {
        if (!button?.reply?.title) {
          return {
            message: "Button node buttons title are required",
            isValid: false,
          };
        }
      }
    }
  }

  return {
    message: "Content is required",
    isValid: false,
  };
};
