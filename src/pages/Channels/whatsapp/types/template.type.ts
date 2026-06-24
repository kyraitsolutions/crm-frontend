export type TemplateCategory = "Marketing" | "Utility" | "Authentication";
export type TemplateLanguage = "English (US)" | "Hindi" | "Spanish" | "French";
export type ButtonStrategy =
  | "No Buttons"
  | "Quick Replies"
  | "Call To Action"
  | "Mixed Actions"
  | "Flow";
export type ButtonType = "URL Button" | "Phone Button" | "Quick Reply";
export type HeaderType = "Text" | "Image" | "Video" | "Document";

export interface TemplateVariable {
  id: string;
  name: string;
  exampleValue: string;
}

export interface TemplateButton {
  id: string;
  type: ButtonType;
  label: string;
  value: string;
}

export interface TemplateState {
  // Step 1: Template Details
  templateName: string;
  category: TemplateCategory;
  language: TemplateLanguage;
  templateType: "Marketing" | "Utility" | "Authentication";

  // Step 2: Compose Template
  headerType: HeaderType;
  headerText: string;
  headerVariables: TemplateVariable[];

  bodyText: string;
  bodyVariables: TemplateVariable[];

  footerText: string;

  buttonStrategy: ButtonStrategy;
  buttons: TemplateButton[];

  // Actions
  setTemplateName: (name: string) => void;
  setCategory: (category: TemplateCategory) => void;
  setLanguage: (language: TemplateLanguage) => void;
  setTemplateType: (type: "Marketing" | "Utility" | "Authentication") => void;

  setHeaderType: (type: HeaderType) => void;
  setHeaderText: (text: string) => void;
  addHeaderVariable: () => void;
  updateHeaderVariable: (
    id: string,
    field: "name" | "exampleValue",
    value: string,
  ) => void;
  removeHeaderVariable: (id: string) => void;

  setBodyText: (text: string) => void;
  addBodyVariable: () => void;
  updateBodyVariable: (
    id: string,
    field: "name" | "exampleValue",
    value: string,
  ) => void;
  removeBodyVariable: (id: string) => void;
  insertVariableToBody: (varName: string, cursorPosition?: number) => void;

  setFooterText: (text: string) => void;

  setButtonStrategy: (strategy: ButtonStrategy) => void;
  addButton: () => void;
  updateButton: (
    id: string,
    field: keyof TemplateButton,
    value: string,
  ) => void;
  removeButton: (id: string) => void;
}

// export type TemplateCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";

// export type ButtonStrategy = "NONE" | "QUICK_REPLY" | "CTA" | "MIXED" | "FLOW";

// export interface TemplateVariable {
//   id: string;
//   name: string;
//   example: string;
// }

// export interface HeaderVariable {
//   id: string;
//   name: string;
//   example: string;
// }

// export interface BodyVariable {
//   id: string;
//   name: string;
//   example: string;
// }

// export interface HeaderConfig {
//   enabled: boolean;
//   text: string;
//   variables: HeaderVariable[];
// }

// export interface TemplateButton {
//   id: string;
//   type: string;
//   text: string;
//   value?: string;
// }

// export interface TemplateForm {
//   name: string;
//   category: TemplateCategory;
//   language: string;
//   header: HeaderConfig;
//   body: string;
//   footer: string;
//   variables: TemplateVariable[];
//   buttonStrategy: ButtonStrategy;
//   buttons: TemplateButton[];
// }
