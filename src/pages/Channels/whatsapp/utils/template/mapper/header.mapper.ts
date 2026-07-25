import type { TemplateComponent } from "../../../types/template.type";
import type { TemplateForm } from "../../../validations/template.schema";

type HeaderData = Pick<
  TemplateForm,
  | "headerType"
  | "headerText"
  | "headerVariables"
  | "variableType"
  | "headerMedia"
>;

export function mapHeader(header: HeaderData): TemplateComponent | null {
  // Text header
  if (header.headerType === "Text") {
    if (!header.headerText.trim()) return null;

    const component: TemplateComponent = {
      type: "HEADER",
      format: "TEXT",
      text: header.headerText,
    };

    if (!header.headerVariables.length) {
      return component;
    }

    if (header.variableType === "Name") {
      component.example = {
        header_text_named_params: header.headerVariables.map((variable) => ({
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
    example: {
      header_handle: [header.headerMedia.previewUrl],
      file: {
        name: header.headerMedia.name,
        size: header.headerMedia.size,
        mimeType: header.headerMedia.mimeType,
      },
    },
  };
}

// export function mapHeader(header: HeaderData): TemplateComponent | null {
//   // No header
//   if (!header.headerType || !header.headerText.trim()) {
//     return null;
//   }

//   // Media headers
//   if (header.headerType !== "Text") {
//     return {
//       type: "HEADER",
//       format: header.headerType.toUpperCase(),
//     };
//   }

//   const component: TemplateComponent = {
//     type: "HEADER",
//     format: "TEXT",
//     text: header.headerText,
//   };

//   // No variables
//   if (!header.headerVariables.length) {
//     return component;
//   }

//   // Named parameters
//   if (header.variableType === "Name") {
//     component.example = {
//       header_text_named_params: header.headerVariables.map((variable) => ({
//         param_name: variable.name,
//         example: variable.exampleValue,
//       })),
//     };

//     return component;
//   }

//   // Positional parameters
//   component.example = {
//     header_text: header.headerVariables.map(
//       (variable) => variable.exampleValue,
//     ),
//   };

//   return component;

// }
