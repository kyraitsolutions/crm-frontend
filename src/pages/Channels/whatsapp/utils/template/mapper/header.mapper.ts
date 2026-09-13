import type { TTemplateComponent } from "../../../types/templates";
import type { TemplateForm } from "../../../validations/template.schema";

type HeaderData = Pick<
  TemplateForm,
  | "headerType"
  | "headerText"
  | "headerVariables"
  | "variableType"
  | "headerMedia"
>;

export function mapHeader(header: HeaderData): TTemplateComponent | null {
  // Text header
  if (header.headerType === "Text") {
    if (!header.headerText.trim()) return null;

    const component: TTemplateComponent = {
      type: "HEADER",
      format: "TEXT",
      text: header.headerText,
      variableMappings: [],
    };

    if (!header.headerVariables.length) {
      return component;
    }

    if (header.variableType === "Name") {
      component.example = {
        header_text_named_params: header.headerVariables
          .filter((variable): variable is typeof variable & { name: string } =>
            Boolean(variable.name),
          )
          .map((variable) => ({
            param_name: variable.name,
            example: variable.exampleValue,
          })),
      };
    } else {
      component.example = {
        header_text: header.headerVariables.map(
          (variable) => variable.exampleValue,
        ),
      };
    }

    return component;
  }

  // Media header
  if (!header.headerMedia) {
    return null;
  }

  return {
    type: "HEADER",
    format: header.headerType.toUpperCase(),
    media: {
      link: header.headerMedia.previewUrl,
      name: header.headerMedia.name,
      size: header.headerMedia.size,
      mimeType: header.headerMedia.mimeType,
    },
  };
}
