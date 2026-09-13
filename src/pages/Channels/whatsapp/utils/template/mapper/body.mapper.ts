import type { TTemplateComponent } from "../../../types/templates";
import type { TemplateForm } from "../../../validations/template.schema";

type BodyData = Pick<
  TemplateForm,
  "bodyText" | "bodyVariables" | "variableType"
>;

export function mapBody(body: BodyData): TTemplateComponent {
  const component: TTemplateComponent = {
    type: "BODY",
    text: body.bodyText,
    variableMappings: [],
  };

  if (!body.bodyVariables.length) {
    return component;
  }

  if (body.variableType === "Number") {
    component.example = {
      body_text: [body.bodyVariables.map((variable) => variable.exampleValue)],
    };
  } else {
    component.example = {
      body_text_named_params: body.bodyVariables
        .filter((variable): variable is typeof variable & { name: string } =>
          Boolean(variable.name),
        )
        .map((variable) => ({
          param_name: variable.name,
          example: variable.exampleValue,
        })),
    };
  }

  return component;
}
