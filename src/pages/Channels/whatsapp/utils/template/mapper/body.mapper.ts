import type {
  TemplateComponent,
  TemplateState,
} from "../../../types/template.type";

type BodyData = Pick<
  TemplateState,
  "bodyText" | "bodyVariables" | "variableType"
>;

export function mapBody(body: BodyData): TemplateComponent {
  const component: TemplateComponent = {
    type: "BODY",
    text: body.bodyText,
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
      body_text_named_params: body.bodyVariables.map((variable) => ({
        param_name: variable.name,
        example: variable.exampleValue,
      })),
    };
  }

  return component;
}
