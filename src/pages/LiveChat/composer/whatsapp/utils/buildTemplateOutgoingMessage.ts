import type {
  TTemplate,
  TTemplateComponent,
} from "@/pages/Channels/whatsapp/types/templates";
import type { TOutgoingMessage } from "./buildOutgoingMessage";
import { extractVariableIds } from "@/pages/Channels/whatsapp/utils/template/template.utils";

export const buildTemplateOutgoingMessage = (
  template: TTemplate,
  variables: Record<string, string>,
): TOutgoingMessage => {
  const components = [];

  const header = template.components.find(
    (component) => component?.type === "HEADER",
  );

  const body = template.components.find(
    (component) => component.type === "BODY",
  );

  const footer = template.components.find(
    (component) => component.type === "FOOTER",
  );

  const buttons = template.components.find(
    (component) => component.type === "BUTTONS",
  );

  // HEADER
  if (header && header?.text) {
    const variableIds = extractVariableIds(
      header.text,
      template.parameterFormat as "NUMBER" | "NAMED",
    );

    components.push({
      type: "HEADER",
      text: replaceTemplateVariables(
        header.text,
        variables,
        "HEADER",
        template.parameterFormat,
      ),
      parameters: variableIds.map((id) => ({
        type: "text",
        text: variables[`HEADER:${id}`] ?? "",
      })),
    });
  }

  // BODY
  if (body && body?.text) {
    const variableIds = extractVariableIds(
      body.text,
      template.parameterFormat as "NUMBER" | "NAMED",
    );

    components.push({
      type: "BODY",
      text: replaceTemplateVariables(
        body.text,
        variables,
        "BODY",
        template.parameterFormat,
      ),
      parameters: variableIds.map((id) => ({
        type: "text",
        text: variables[`BODY:${id}`] ?? "",
      })),
    });
  }

  // FOOTER
  if (footer && footer?.text) {
    components.push({
      type: "FOOTER",
      text: footer.text,
    });
  }

  if (buttons) {
    components.push({
      type: "BUTTONS",
      buttons: buttons?.buttons,
    });
  }

  return {
    type: "template",
    payload: {
      name: template.name,
      language: template.language,
      category: template.category,
      components: components,
    },
  };
};

export const replaceTemplateVariables = (
  text: string,
  variables: Record<string, string>,
  component: TTemplateComponent["type"],
  parameterFormat: TTemplate["parameterFormat"],
) => {
  const regex = parameterFormat === "Name" ? /{{([^{}]+)}}/g : /{{(\d+)}}/g;

  return text.replace(regex, (_, id: string) => {
    const variableId = id.trim();
    return variables[`${component}:${variableId}`] ?? `{{${variableId}}}`;
  });
};
