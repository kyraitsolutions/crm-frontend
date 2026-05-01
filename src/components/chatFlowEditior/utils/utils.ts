import { v4 as uuid } from "uuid";
export const createInitialElementsData = (type: string) => {
  switch (type) {
    case "date":
      return [
        {
          id: uuid(),
          type: "date",
          content: "",
        },
      ];

    case "send_message":
      return [
        {
          id: uuid(),
          type: "text",
          content: "",
        },
      ];

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
                  id: `btn_1_${uuid()}`,
                  title: "Button 1",
                },
              },
            ],
          },
        },
      };

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
                    id: `section_1_row_1_${uuid()}`,
                    title: "Row Title",
                    description: "",
                  },
                ],
              },
            ],
          },
        },
      };

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
              {
                card_index: 1,
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
      };

    case "question":
      return {
        type: "question",
        question: {
          text: "",
          inputType: "text",
        },
      };

    default:
      return [];
  }
};

export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 10);
