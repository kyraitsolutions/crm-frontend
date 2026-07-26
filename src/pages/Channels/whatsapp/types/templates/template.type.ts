// // Template Types

import type {
  ButtonKind,
  HeaderType,
  TemplateCategory,
  TemplateType,
  UrlType,
  VariableType,
  WhatsAppActiveFor,
} from "./template.enums";

export type TemplateHeaderMedia = {
  file: File;
  previewUrl: string;
  mimeType: string;
  size: number;
};

export interface TemplateVariable {
  id: string;
  name: string;
  exampleValue: string;
}

export interface TemplateTypeOption {
  value: TemplateType;
  title: string;
  description: string;
}

export interface ButtonErrors {
  label?: string;
  url?: string;
  phoneNumber?: string;
  countryCode?: string;
  offerCode?: string;
}
export interface TemplateButton {
  id: string;
  // Button type
  kind: ButtonKind;
  // Common
  label: string;

  // URL Button
  url?: string;
  urlType?: UrlType;
  trackConversions?: boolean;

  // Phone Button
  country?: string;
  countryCode?: string;
  phoneNumber?: string;

  // Call on WhatsApp
  activeFor?: WhatsAppActiveFor;

  // Copy Code
  offerCode?: string;

  // Validation
  errors?: ButtonErrors;
}

export interface ButtonTypeConfig {
  kind: ButtonKind;
  label: string;
  description: string;
  maxCount: number;
  icon?: string;
  fields: string[];
  supportsTracking?: boolean;
  urlTypes?: ("STATIC" | "DYNAMIC")[];
  editableLabel?: boolean;
}

// Store State for Template Builder
export interface TemplateState {
  // Step 1
  templateName: string;
  category: TemplateCategory;
  language: string;
  templateType: TemplateType;

  // Step 2
  headerType: HeaderType;
  headerText: string;
  headerMedia?: TemplateHeaderMedia;
  headerVariables: TemplateVariable[];

  bodyText: string;
  bodyVariables: TemplateVariable[];

  footerText: string;
  variableType: VariableType;

  // Buttons
  buttons: TemplateButton[];

  // Template
  setTemplateName: (name: string) => void;
  setCategory: (category: TemplateCategory) => void;
  setLanguage: (language: string) => void;
  setTemplateType: (type: TemplateType) => void;

  // Header
  setHeaderType: (type: HeaderType) => void;
  setHeaderText: (text: string) => void;

  setHeaderMedia: (file: File) => void;
  clearHeaderMedia: () => void;

  addHeaderVariable: () => void;
  updateHeaderVariable: (
    id: string,
    field: "name" | "exampleValue",
    value: string,
  ) => void;
  removeHeaderVariable: (id: string) => void;

  // Body
  setBodyText: (text: string) => void;

  addBodyVariable: () => void;

  updateBodyVariable: (
    id: string,
    field: "name" | "exampleValue",
    value: string,
  ) => void;

  removeBodyVariable: (id: string) => void;

  insertVariableToBody: (varName: string, cursorPosition?: number) => void;

  // Footer
  setFooterText: (text: string) => void;

  setVariableType: (variable: VariableType) => void;

  // Buttons
  addButton: (kind: ButtonKind) => void;

  updateButton: (id: string, data: Partial<TemplateButton>) => void;

  removeButton: (id: string) => void;
}

export interface TemplateComponent {
  type: string;
  [key: string]: any;
}

export interface TemplatePayload {
  name: string;
  language: string;
  category: string;
  components: TemplateComponent[];
}

// Store State for Template Lists
