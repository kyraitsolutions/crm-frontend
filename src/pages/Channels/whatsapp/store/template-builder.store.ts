import { create } from "zustand";
import type {
  TemplateState,
  TemplateVariable,
  VariableType,
} from "../types/template.type";
import { generateId } from "@/utils/generateId.utils";
import { createButton } from "../utils/template/template.utils";

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
  language: "en_IN",
  category: "Utility",
  templateType: "CUSTOM",

  headerType: "Text",
  headerText: "",
  headerVariables: [],

  bodyText: "",
  bodyVariables: [],

  footerText: "",

  buttonStrategy: "Mixed Actions",
  buttons: [],

  variableType: "Number",
  suggestedVariables: SUGGESTED_VARIABLES,

  setTemplateName: (name) => set({ templateName: name }),
  setCategory: (category) => set({ category }),
  setLanguage: (language) => set({ language }),
  setTemplateType: (templateType) => set({ templateType }),

  setHeaderType: (headerType) => set({ headerType }),
  setHeaderText: (headerText) => set({ headerText }),
  setHeaderMedia: (file: File) => {
    const previous = get().headerMedia;

    if (previous?.previewUrl) {
      URL.revokeObjectURL(previous.previewUrl);
    }

    set({
      headerMedia: {
        file,
        previewUrl: URL.createObjectURL(file),
        mimeType: file.type,
        size: file.size,
      },
    });
  },
  clearHeaderMedia: () => {
    const previous = get().headerMedia;

    if (previous?.previewUrl) {
      URL.revokeObjectURL(previous.previewUrl);
    }

    set({
      headerMedia: undefined,
    });
  },

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

  // setBodyText: (bodyText) => set({ bodyText }),
  setBodyText: (bodyText) => {
    const { variableType, bodyVariables } = get();

    if (variableType === "Number") {
      set({ bodyText });
      return;
    }

    // Match {{user_name}}
    const matches = [...bodyText.matchAll(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g)];

    const variables = matches.map((match, index) => ({
      id: bodyVariables[index]?.id ?? generateId(),
      name: match[1],
      exampleValue: bodyVariables[index]?.exampleValue ?? "",
    }));

    set({
      bodyText,
      bodyVariables: variables,
    });
  },

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

  updateBodyVariable: (id, field, value) => {
    const { bodyVariables, bodyText, variableType } = get();

    const index = bodyVariables.findIndex((v) => v.id === id);

    if (index === -1) return;

    const variables = bodyVariables.map((v) =>
      v.id === id ? { ...v, [field]: value } : v,
    );

    let newBody = bodyText;

    if (field === "name" && variableType === "Name") {
      const oldName = bodyVariables[index].name;

      if (oldName) {
        // rename existing placeholder
        newBody = newBody.replace(
          new RegExp(`\\{\\{${oldName}\\}\\}`, "g"),
          `{{${value}}}`,
        );
      } else {
        // first time replacing {{}}
        newBody = newBody.replace("{{}}", `{{${value}}}`);
      }
    }

    set({
      bodyVariables: variables,
      bodyText: newBody,
    });
  },
  // updateBodyVariable: (id, field, value) =>
  //   set({
  //     bodyVariables: get().bodyVariables.map((v) =>
  //       v.id === id ? { ...v, [field]: value } : v,
  //     ),
  //   }),
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
    const { bodyVariables, bodyText, variableType } = get();

    const nextIdx = bodyVariables.length + 1;

    const placeholder = variableType === "Number" ? `{{${nextIdx}}}` : "{{}}";

    const newVar: TemplateVariable = {
      id: generateId(),
      name: varName,
      exampleValue: "",
    };

    let newBody: string;

    if (cursorPos !== undefined) {
      newBody =
        bodyText.slice(0, cursorPos) + placeholder + bodyText.slice(cursorPos);
    } else {
      newBody = `${bodyText} ${placeholder}`;
    }

    set({
      bodyVariables: [...bodyVariables, newVar],
      bodyText: newBody,
    });
  },

  setFooterText: (footerText) => set({ footerText }),

  setVariableType: (variableType: VariableType) => set({ variableType }),

  addButton: (kind) => {
    const buttons = get().buttons;
    if (buttons.length >= 10) return;

    set({
      buttons: [...buttons, createButton(kind)],
    });
  },
  updateButton: (id, data) =>
    set({
      buttons: get().buttons.map((button) =>
        button.id === id
          ? {
              ...button,
              ...data,
            }
          : button,
      ),
    }),
  // updateButton: (id, field, value) =>
  //   set({
  //     buttons: get().buttons.map((b) =>
  //       b.id === id ? { ...b, [field]: value } : b,
  //     ),
  //   }),
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
