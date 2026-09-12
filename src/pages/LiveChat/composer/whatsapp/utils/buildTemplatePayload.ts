// utils/whatsapp/buildTemplatePayload.ts

import type { TTemplate } from "@/pages/Channels/whatsapp/types/templates";
import { extractVariableIds } from "@/pages/Channels/whatsapp/utils/template/template.utils";

interface BuildTemplatePayloadParams {
  phoneNumber: string;
  template: TTemplate;
  variables: Record<string, string>;
}

export const buildTemplatePayload = ({
  phoneNumber,
  template,
  variables,
}: BuildTemplatePayloadParams) => {
  const header = template.components.find(
    (component) => component.type.toUpperCase() === "HEADER",
  );

  const body = template.components.find(
    (component) => component.type?.toUpperCase() === "BODY",
  );

  const components = [];

  // HEADER variables
  if (header && header?.text) {
    const variableIds = extractVariableIds(
      header.text,
      template.parameterFormat as "NUMBER" | "NAMED",
    );

    if (variableIds.length > 0) {
      components.push({
        type: "header",
        parameters: variableIds.map((id) => ({
          type: "text",
          text: variables[`HEADER:${id}`] ?? "",
        })),
      });
    }
  }

  // BODY variables
  if (body && body?.text) {
    const variableIds = extractVariableIds(
      body.text,
      template.parameterFormat as "NUMBER" | "NAMED",
    );

    if (variableIds.length > 0) {
      components.push({
        type: "body",
        parameters: variableIds.map((id) => ({
          type: "text",
          text: variables[`BODY:${id}`] ?? "",
        })),
      });
    }
  }

  return {
    to: phoneNumber,
    type: "template",

    template: {
      name: template.name,
      parameter_format: template.parameterFormat,
      language: {
        code: template.language,
      },
      components,
    },
  };
};
