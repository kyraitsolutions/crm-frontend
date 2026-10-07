import type { TButtonNodeData, TTemplateNodeDataPayload } from "../types/types";

export const validateSendMessageNode = (payload: any) => {
  console.log(payload)
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

  return {
    message:"Node validate successfully",
    isValid:true
  };
  // return null;
};

export const validateTemplateNode = (
  payload: TTemplateNodeDataPayload | null,
) => {
  if (!payload?.template?.id || !payload.template.name) {
    return {
      message: "Select an approved WhatsApp template",
      isValid: false,
    };
  }

  return {
    message: "Node validated successfully",
    isValid: true,
  };
};

export const validateQuestionNode = (payload: any) => {
  const question = payload?.question || {};
  if (!String(question.text || "").trim()) {
    return { message: "Ask Question needs question text", isValid: false };
  }
  if (question.inputType === "buttons") {
    const options = (question.options || []).map((option: string) => String(option || "").trim()).filter(Boolean);
    if (!options.length || options.length > 3) {
      return { message: "Buttons need 1 to 3 options", isValid: false };
    }
  }
  return { message: "Node validated successfully", isValid: true };
};

export const validateActionNode = (type: string, payload: any) => {
  if (type === "keyword" && !String(payload?.keyword?.words || "").trim()) {
    return { message: "Keyword node needs at least one word", isValid: false };
  }
  if (type === "set_attribute" && !String(payload?.attribute?.key || "").trim()) {
    return { message: "Set Attribute needs a name", isValid: false };
  }
  if (
    (type === "add_tag" || type === "remove_tag") &&
    !String(payload?.tag?.name || "").trim()
  ) {
    return { message: "Tag node needs a tag name", isValid: false };
  }
  if (type === "goto" && !payload?.goto?.targetNodeId) {
    return { message: "Go To needs a target node", isValid: false };
  }
  if (type === "api_request" && !String(payload?.request?.url || "").trim()) {
    return { message: "API Request needs an HTTPS URL", isValid: false };
  }
  if (type === "condition" && !payload?.condition?.rules?.length) {
    return { message: "Condition needs at least one rule", isValid: false };
  }
  if (
    (type === "ask_address" || type === "ask_location" || type === "ask_media") &&
    !String(payload?.ask?.text || "").trim()
  ) {
    return { message: "Enter the message this node should send", isValid: false };
  }
  if (type === "connect_flow" && !payload?.connect?.chatFlowId) {
    return { message: "Connect Flow needs a published flow", isValid: false };
  }
  return { message: "Node validated successfully", isValid: true };
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
    message: "Node validated successfully",
    isValid: true,
  };
};
