import { generateId } from "@/utils/generateId.utils";
import { create } from "zustand";
import type { VariableType } from "../types/templates";
import type {
  TemplateState,
  TemplateVariable,
} from "../types/templates/template.type";
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
        { id: generateId(), name: "", exampleValue: "", component: "HEADER" },
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
      component: "BODY" as const,
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
      component: "BODY",
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
      component: "BODY",
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

  removeButton: (id) =>
    set({ buttons: get().buttons.filter((b) => b.id !== id) }),
}));
