import { create } from "zustand";
import type {
  ButtonType,
  TemplateState,
  TemplateVariable,
} from "../types/template.type";

const generateId = () => Math.random().toString(36).substring(2, 9);

let _bodyCursorPos: number | undefined = undefined;
export const setBodyCursorPos = (pos: number) => {
  _bodyCursorPos = pos;
};
export const getBodyCursorPos = () => _bodyCursorPos;

const SUGGESTED_VARIABLES = [
  "customer_name",
  "customer_phone",
  "customer_email",
  "order_id",
  "order_date",
  "amount",
  "delivery_address",
  "company_name",
  "tracking_number",
  "appointment_date",
];

export const useTemplateStore = create<
  TemplateState & { suggestedVariables: string[] }
>((set, get) => ({
  templateName: "",
  category: "Utility",
  language: "English (US)",
  templateType: "Utility",

  headerType: "Text",
  headerText: "",
  headerVariables: [
    { id: generateId(), name: "customer_name", exampleValue: "John" },
  ],

  bodyText: "",
  bodyVariables: [],

  footerText: "",

  buttonStrategy: "Mixed Actions",
  buttons: [
    {
      id: generateId(),
      type: "URL Button",
      label: "Track Order",
      value: "https://crm.com/order/{{1}}",
    },
    {
      id: generateId(),
      type: "Phone Button",
      label: "Call Support",
      value: "+91 9876543210",
    },
    {
      id: generateId(),
      type: "Quick Reply",
      label: "Order Status",
      value: "ORDER_STATUS",
    },
    {
      id: generateId(),
      type: "Quick Reply",
      label: "Cancel Order",
      value: "CANCEL_ORDER",
    },
    {
      id: generateId(),
      type: "Quick Reply",
      label: "Contact Support",
      value: "CONTACT_SUPPORT",
    },
  ],

  suggestedVariables: SUGGESTED_VARIABLES,

  setTemplateName: (name) => set({ templateName: name }),
  setCategory: (category) => set({ category }),
  setLanguage: (language) => set({ language }),
  setTemplateType: (templateType) => set({ templateType }),

  setHeaderType: (headerType) => set({ headerType }),
  setHeaderText: (headerText) => set({ headerText }),

  addHeaderVariable: () => {
    const vars = get().headerVariables;
    if (vars.length >= 1) return; // Header supports 1 variable only
    set({
      headerVariables: [
        ...vars,
        { id: generateId(), name: "", exampleValue: "" },
      ],
    });
  },
  updateHeaderVariable: (id, field, value) =>
    set({
      headerVariables: get().headerVariables.map((v) =>
        v.id === id ? { ...v, [field]: value } : v,
      ),
    }),
  removeHeaderVariable: (id) =>
    set({ headerVariables: get().headerVariables.filter((v) => v.id !== id) }),

  setBodyText: (bodyText) => set({ bodyText }),

  addBodyVariable: () => {
    const vars = get().bodyVariables;
    const newVar: TemplateVariable = {
      id: generateId(),
      name: "",
      exampleValue: "",
    };
    const nextIdx = vars.length + 1;
    const currentBody = get().bodyText;
    set({
      bodyVariables: [...vars, newVar],
      bodyText: currentBody + ` {{${nextIdx}}}`,
    });
  },
  updateBodyVariable: (id, field, value) =>
    set({
      bodyVariables: get().bodyVariables.map((v) =>
        v.id === id ? { ...v, [field]: value } : v,
      ),
    }),
  removeBodyVariable: (id) => {
    const vars = get().bodyVariables;
    const idx = vars.findIndex((v) => v.id === id);
    if (idx === -1) return;
    const newVars = vars.filter((v) => v.id !== id);
    // Re-index body text placeholders
    let body = get().bodyText;
    body = body.replace(
      new RegExp(`\\{\\{${idx + 1}\\}\\}`, "g"),
      "__REMOVED__",
    );
    // Shift down subsequent placeholders
    for (let i = idx + 2; i <= vars.length; i++) {
      body = body.replace(new RegExp(`\\{\\{${i}\\}\\}`, "g"), `{{${i - 1}}}`);
    }
    body = body.replace(/__REMOVED__/g, "");
    set({ bodyVariables: newVars, bodyText: body });
  },

  insertVariableToBody: (varName, cursorPos?: number) => {
    const vars = get().bodyVariables;
    const nextIdx = vars.length + 1;
    const placeholder = `{{${nextIdx}}}`;
    const newVar: TemplateVariable = {
      id: generateId(),
      name: varName,
      exampleValue: "",
    };
    const currentBody = get().bodyText;

    let newBody: string;
    if (cursorPos !== undefined) {
      // Insert placeholder at cursor position
      newBody =
        currentBody.slice(0, cursorPos) +
        placeholder +
        currentBody.slice(cursorPos);
    } else {
      // Fallback: append at end
      newBody = currentBody + ` ${placeholder}`;
    }

    set({
      bodyVariables: [...vars, newVar],
      bodyText: newBody,
    });
  },
  // insertVariableToBody: (varName) => {
  //   const vars = get().bodyVariables;
  //   const nextIdx = vars.length + 1;
  //   const newVar: TemplateVariable = {
  //     id: generateId(),
  //     name: varName,
  //     exampleValue: "",
  //   };
  //   set({
  //     bodyVariables: [...vars, newVar],
  //     bodyText: get().bodyText + ` {{${nextIdx}}}`,
  //   });
  // },

  setFooterText: (footerText) => set({ footerText }),

  setButtonStrategy: (buttonStrategy) => {
    if (buttonStrategy === "No Buttons") {
      set({ buttonStrategy, buttons: [] });
    } else if (buttonStrategy === "Call To Action") {
      set({
        buttonStrategy,
        buttons: [
          {
            id: generateId(),
            type: "URL Button",
            label: "Track Order",
            value: "https://crm.com/order/{{1}}",
          },
        ],
      });
    } else if (buttonStrategy === "Quick Replies") {
      set({
        buttonStrategy,
        buttons: [
          {
            id: generateId(),
            type: "Quick Reply",
            label: "Track Order",
            value: "TRACK_ORDER",
          },
        ],
      });
    } else {
      set({ buttonStrategy, buttons: [] });
    }
  },

  addButton: () => {
    const { buttons, buttonStrategy } = get();
    if (buttons.length >= 10) return;
    let type: ButtonType = "Quick Reply";
    if (buttonStrategy === "Call To Action") type = "URL Button";
    set({
      buttons: [...buttons, { id: generateId(), type, label: "", value: "" }],
    });
  },
  updateButton: (id, field, value) =>
    set({
      buttons: get().buttons.map((b) =>
        b.id === id ? { ...b, [field]: value } : b,
      ),
    }),
  removeButton: (id) =>
    set({ buttons: get().buttons.filter((b) => b.id !== id) }),
}));

// import { create } from "zustand";

// import type {
//   ButtonStrategy,
//   TemplateButton,
//   TemplateCategory,
//   TemplateVariable,
// } from "../types/template.type";

// interface TemplateBuilderStore {
//   // ======================
//   // TEMPLATE DETAILS
//   // ======================

//   name: string;
//   category: TemplateCategory;
//   language: string;
//   templateType: string;

//   // ======================
//   // CONTENT
//   // ======================

//   header: string;
//   body: string;
//   footer: string;

//   // ======================
//   // VARIABLES
//   // ======================

//   headerVariables: TemplateVariable[];
//   bodyVariables: TemplateVariable[];

//   // ======================
//   // BUTTONS
//   // ======================

//   buttonStrategy: ButtonStrategy;
//   buttons: TemplateButton[];

//   // ======================
//   // UI
//   // ======================

//   previewMode: "mobile" | "desktop";

//   // ======================
//   // ACTIONS
//   // ======================

//   setName: (value: string) => void;

//   setCategory: (category: TemplateCategory) => void;

//   setLanguage: (language: string) => void;

//   setTemplateType: (type: string) => void;

//   setHeader: (header: string) => void;

//   setBody: (body: string) => void;

//   setFooter: (footer: string) => void;

//   setPreviewMode: (mode: "mobile" | "desktop") => void;

//   // VARIABLES

//   addHeaderVariable: (variable: TemplateVariable) => void;

//   removeHeaderVariable: (id: string) => void;

//   addBodyVariable: (variable: TemplateVariable) => void;

//   removeBodyVariable: (id: string) => void;

//   // BUTTONS

//   setButtonStrategy: (strategy: ButtonStrategy) => void;

//   addButton: (button: TemplateButton) => void;

//   updateButton: (id: string, button: Partial<TemplateButton>) => void;

//   removeButton: (id: string) => void;

//   // RESET

//   resetTemplate: () => void;
// }

// export const useTemplateBuilderStore = create<TemplateBuilderStore>((set) => ({
//   // TEMPLATE

//   name: "",

//   category: "UTILITY",

//   language: "en_US",

//   templateType: "Order Update",

//   // CONTENT

//   header: "",

//   body: "",

//   footer: "",

//   // VARIABLES

//   headerVariables: [],

//   bodyVariables: [],

//   // BUTTONS

//   buttonStrategy: "NONE",

//   buttons: [],

//   // UI

//   previewMode: "mobile",

//   // ACTIONS

//   setName: (name) => set({ name }),

//   setCategory: (category) => set({ category }),

//   setLanguage: (language) => set({ language }),

//   setTemplateType: (templateType) =>
//     set({
//       templateType,
//     }),

//   setHeader: (header) =>
//     set({
//       header,
//     }),

//   setBody: (body) =>
//     set({
//       body,
//     }),

//   setFooter: (footer) =>
//     set({
//       footer,
//     }),

//   setPreviewMode: (previewMode) =>
//     set({
//       previewMode,
//     }),

//   addHeaderVariable: (variable) =>
//     set((state) => ({
//       headerVariables: [...state.headerVariables, variable],
//     })),

//   removeHeaderVariable: (id) =>
//     set((state) => ({
//       headerVariables: state.headerVariables.filter((item) => item.id !== id),
//     })),

//   addBodyVariable: (variable) =>
//     set((state) => ({
//       bodyVariables: [...state.bodyVariables, variable],
//     })),

//   removeBodyVariable: (id) =>
//     set((state) => ({
//       bodyVariables: state.bodyVariables.filter((item) => item.id !== id),
//     })),

//   setButtonStrategy: (buttonStrategy) =>
//     set({
//       buttonStrategy,
//     }),

//   addButton: (button) =>
//     set((state) => ({
//       buttons: [...state.buttons, button],
//     })),

//   updateButton: (id, updatedButton) =>
//     set((state) => ({
//       buttons: state.buttons.map((button) =>
//         button.id === id
//           ? {
//               ...button,
//               ...updatedButton,
//             }
//           : button,
//       ),
//     })),

//   removeButton: (id) =>
//     set((state) => ({
//       buttons: state.buttons.filter((button) => button.id !== id),
//     })),

//   resetTemplate: () =>
//     set({
//       name: "",

//       category: "UTILITY",

//       language: "en_US",

//       templateType: "Order Update",

//       header: "",

//       body: "",

//       footer: "",

//       headerVariables: [],

//       bodyVariables: [],

//       buttonStrategy: "NONE",

//       buttons: [],

//       previewMode: "mobile",
//     }),
// }));

// import { create } from "zustand";

// import type {
//   ButtonStrategy,
//   TemplateButton,
//   TemplateCategory,
//   TemplateVariable,
// } from "../types/template.type";

// interface TemplateBuilderStore {
//   name: string;
//   category: TemplateCategory;
//   language: string;
//   header: string;
//   body: string;
//   footer: string;
//   variables: TemplateVariable[];
//   buttonStrategy: ButtonStrategy;
//   buttons: TemplateButton[];

//   setName: (value: string) => void;
//   setCategory: (category: TemplateCategory) => void;
//   setLanguage: (language: string) => void;
//   setHeader: (header: string) => void;
//   setBody: (body: string) => void;
//   setFooter: (footer: string) => void;
//   addVariable: (variable: TemplateVariable) => void;
//   removeVariable: (id: string) => void;
//   setButtonStrategy: (strategy: ButtonStrategy) => void;
//   addButton: (button: TemplateButton) => void;
//   removeButton: (id: string) => void;
// }

// export const useTemplateBuilderStore = create<TemplateBuilderStore>((set) => ({
//   name: "",

//   category: "UTILITY",

//   language: "en_US",

//   header: "",

//   body: "",

//   footer: "",

//   variables: [],

//   buttonStrategy: "NONE",

//   buttons: [],

//   setName: (name) =>
//     set({
//       name,
//     }),

//   setCategory: (category) =>
//     set({
//       category,
//     }),

//   setLanguage: (language) =>
//     set({
//       language,
//     }),

//   setHeader: (header) =>
//     set({
//       header,
//     }),

//   setBody: (body) =>
//     set({
//       body,
//     }),

//   setFooter: (footer) =>
//     set({
//       footer,
//     }),

//   addVariable: (variable) =>
//     set((state) => ({
//       variables: [...state.variables, variable],
//     })),

//   removeVariable: (id) =>
//     set((state) => ({
//       variables: state.variables.filter((item) => item.id !== id),
//     })),

//   setButtonStrategy: (buttonStrategy) =>
//     set({
//       buttonStrategy,
//     }),

//   addButton: (button) =>
//     set((state) => ({
//       buttons: [...state.buttons, button],
//     })),

//   removeButton: (id) =>
//     set((state) => ({
//       buttons: state.buttons.filter((item) => item.id !== id),
//     })),
// }));
