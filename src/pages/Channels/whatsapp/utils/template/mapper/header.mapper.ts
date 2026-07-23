import type {
  TemplateComponent,
  TemplateState,
} from "../../../types/template.type";

type HeaderData = Pick<
  TemplateState,
  "headerType" | "headerText" | "headerVariables" | "variableType"
>;

export function mapHeader(header: HeaderData): TemplateComponent | null {
  // No header
  if (!header.headerType || !header.headerText.trim()) {
    return null;
  }

  // Media headers
  if (header.headerType !== "Text") {
    return {
      type: "HEADER",
      format: header.headerType.toUpperCase(),
    };
  }

  const component: TemplateComponent = {
    type: "HEADER",
    format: "TEXT",
    text: header.headerText,
  };

  // No variables
  if (!header.headerVariables.length) {
    return component;
  }

  // Named parameters
  if (header.variableType === "Name") {
    component.example = {
      header_text_named_params: header.headerVariables.map((variable) => ({
        param_name: variable.name,
        example: variable.exampleValue,
      })),
    };

    return component;
  }

  // Positional parameters
  component.example = {
    header_text: header.headerVariables.map(
      (variable) => variable.exampleValue,
    ),
  };

  return component;
}
