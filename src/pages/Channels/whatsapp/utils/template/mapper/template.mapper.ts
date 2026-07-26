import type { TemplateForm } from "../../../validations/template.schema";
import { mapBody } from "./body.mapper";
import { mapButtons } from "./button.mapper";
import { mapFooter } from "./footer.mapper";
import { mapHeader } from "./header.mapper";

export const mapTemplateToPayload = (state: TemplateForm) => {
  const components = [
    mapHeader(state),
    mapBody(state),
    mapFooter(state),
    mapButtons(state.buttons || []),
  ].filter(Boolean);

  return {
    name: state.templateName,
    language: state.language,
    category: state.category.toUpperCase(),
    parameter_format: state.variableType === "Number" ? "POSITIONAL" : "NAMED",
    components,
  };
};
