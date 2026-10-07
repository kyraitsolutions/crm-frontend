import type {
  TButtonNodeDataPayload,
  TCarouselNodeDataPayload,
  TListNodeDataPayload,
  TNodeType,
  TFlowActionPayload,
  TFlowActionType,
  TQuestionNodeDataPayload,
  TSendMessageNodeDataPayload,
  TTemplateNodeDataPayload,
} from "../types/types";

export type TPayloadMap = {
  send_message: TSendMessageNodeDataPayload;
  button: TButtonNodeDataPayload;
  list: TListNodeDataPayload;
  carousel: TCarouselNodeDataPayload;
  question: TQuestionNodeDataPayload;
  template: TTemplateNodeDataPayload;
  keyword: TFlowActionPayload;
  condition: TFlowActionPayload;
  set_attribute: TFlowActionPayload;
  add_tag: TFlowActionPayload;
  remove_tag: TFlowActionPayload;
  delay: TFlowActionPayload;
  goto: TFlowActionPayload;
  end: TFlowActionPayload;
  api_request: TFlowActionPayload;
  handoff: TFlowActionPayload;
  ask_address: TFlowActionPayload;
  ask_location: TFlowActionPayload;
  ask_media: TFlowActionPayload;
  connect_flow: TFlowActionPayload;
};

export const createInitialElementsData = <T extends TNodeType>(
  type: T,
): TPayloadMap[T] => {
  switch (type) {
    case "send_message":
      return [
        {
          id: createId(),
          type: "text",
          content: "",
        },
      ] as TPayloadMap[T];

    case "button":
      return {
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: "",
          },
          body: {
            text: "",
          },
          footer: {
            text: "",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: `btn_1_${createId()}`,
                  title: "Button 1",
                },
              },
            ],
          },
        },
      } as TPayloadMap[T];

    case "list":
      return {
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "",
          },
          body: {
            text: "",
          },
          footer: {
            text: "",
          },
          action: {
            button: "Button Text",
            sections: [
              {
                title: "Section Title",
                rows: [
                  {
                    id: `section_1_row_1_${createId()}`,
                    title: "Row Title",
                    description: "",
                  },
                ],
              },
            ],
          },
        },
      } as TPayloadMap[T];

    case "carousel":
      return {
        type: "interactive",
        interactive: {
          type: "carousel",
          body: {
            text: "",
          },
          action: {
            cards: [
              {
                card_index: 0,
                type: "cta_url",
                header: {
                  type: "image",
                  image: {
                    link: "",
                  },
                },
                body: {
                  text: "",
                },
                action: {
                  name: "cta_url",
                  parameters: {
                    display_text: "Buy Now",
                    url: "",
                  },
                },
              },
            ],
          },
        },
      } as TPayloadMap[T];

    case "question":
      return {
        type: "question",
        question: {
          text: "",
          inputType: "text",
          required: true,
          attribute: "",
          retryMessage: "",
          maxAttempts: 2,
          options: [] as string[],
        },
      } as TPayloadMap[T];

    case "template":
      return {
        type: "template",
        template: null,
      } as TPayloadMap[T];

    case "keyword":
    case "condition":
    case "set_attribute":
    case "add_tag":
    case "remove_tag":
    case "delay":
    case "goto":
    case "end":
    case "api_request":
    case "handoff":
    case "ask_address":
    case "ask_location":
    case "ask_media":
    case "connect_flow":
      return createActionPayload(type) as TPayloadMap[T];

    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
};

// export const createInitialElementsData = (type: TNodeType) => {
//   switch (type) {
//     case "send_message":
//       return [
//         {
//           id: createId(),
//           type: "text",
//           content: "",
//         },
//       ];

//     case "button":
//       return {
//         type: "interactive",
//         interactive: {
//           type: "button",
//           header: {
//             type: "text",
//             text: "",
//           },
//           body: {
//             text: "",
//           },
//           footer: {
//             text: "",
//           },
//           action: {
//             buttons: [
//               {
//                 type: "reply",
//                 reply: {
//                   id: `btn_1_${createId()}`,
//                   title: "Button 1",
//                 },
//               },
//             ],
//           },
//         },
//       };

//     case "list":
//       return {
//         type: "interactive",
//         interactive: {
//           type: "list",
//           header: {
//             type: "text",
//             text: "",
//           },
//           body: {
//             text: "",
//           },
//           footer: {
//             text: "",
//           },

//           action: {
//             button: "Button Text",
//             sections: [
//               {
//                 title: "Section Title",
//                 rows: [
//                   {
//                     id: `section_1_row_1_${createId()}`,
//                     title: "Row Title",
//                     description: "",
//                   },
//                 ],
//               },
//             ],
//           },
//         },
//       };

//     case "carousel":
//       return {
//         type: "interactive",
//         interactive: {
//           type: "carousel",
//           body: {
//             text: "",
//           },
//           action: {
//             cards: [
//               {
//                 card_index: 0,
//                 type: "cta_url",
//                 header: {
//                   type: "image",
//                   image: {
//                     link: "",
//                   },
//                 },
//                 body: {
//                   text: "",
//                 },
//                 action: {
//                   name: "cta_url",
//                   parameters: {
//                     display_text: "Buy Now",
//                     url: "",
//                   },
//                 },
//               },
//               {
//                 card_index: 1,
//                 type: "cta_url",
//                 header: {
//                   type: "image",
//                   image: {
//                     link: "",
//                   },
//                 },
//                 body: {
//                   text: "",
//                 },
//                 action: {
//                   name: "cta_url",
//                   parameters: {
//                     display_text: "Buy Now",
//                     url: "",
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       };

//     case "question":
//       return {
//         type: "question",
//         question: {
//           text: "",
//           inputType: "text",
//         },
//       };

//     default:
//       return [];
//   }
// };

const createActionPayload = (type: TFlowActionType): TFlowActionPayload => {
  switch (type) {
    case "keyword":
      return { type, keyword: { words: "", match: "contains", caseSensitive: false } };
    case "condition":
      return {
        type,
        condition: {
          match: "all",
          rules: [{ left: "{{reply}}", operator: "contains", right: "" }],
        },
      };
    case "set_attribute":
      return {
        type,
        attribute: { key: "", value: "{{reply}}", scope: "flow", dataType: "text" },
      };
    case "add_tag":
    case "remove_tag":
      return { type, tag: { name: "" } };
    case "delay":
      return { type, delay: { seconds: 5, unit: "seconds", amount: 5 } };
    case "goto":
      return { type, goto: { targetNodeId: "" } };
    case "end":
      return { type };
    case "api_request":
      return {
        type,
        request: {
          method: "GET",
          url: "",
          headers: [],
          query: [],
          body: "",
          timeoutMs: 8000,
          saveAs: "api",
        },
      };
    case "handoff":
      return {
        type,
        handoff: { note: "", reason: "", priority: "normal", customerMessage: "" },
      };
    case "ask_address":
      return { type, ask: { text: "Please share your full address." } };
    case "ask_location":
      return { type, ask: { text: "Please share your location." } };
    case "ask_media":
      return { type, ask: { text: "Please send a photo, video, or document." } };
    case "connect_flow":
      return { type, connect: { chatFlowId: "" } };
  }
};

export function migrateLegacyAskNodes<T extends { type?: string; data?: any }>(nodes: T[]) {
  return nodes.map((node) => {
    const type = node?.type || node?.data?.type;
    if (type !== "ask_address" && type !== "ask_location" && type !== "ask_media") {
      return node;
    }
    const inputType =
      type === "ask_address" ? "address" : type === "ask_location" ? "location" : "media";
    const ask = node?.data?.payload?.ask || {};
    const previous = node?.data?.payload?.question || {};
    return {
      ...node,
      type: "question",
      data: {
        ...node.data,
        type: "question",
        label: node.data?.label || "Ask Question",
        payload: {
          ...node.data?.payload,
          type: "question",
          legacyAsk: { type, ask },
          question: {
            ...previous,
            text: previous.text || ask.text || "",
            inputType,
            required: previous.required ?? true,
            attribute:
              previous.attribute ||
              (inputType === "address"
                ? "address"
                : inputType === "location"
                  ? "location"
                  : "media"),
            maxAttempts: previous.maxAttempts || 2,
            options: previous.options || [],
          },
        },
      },
    };
  });
}

export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 10);
