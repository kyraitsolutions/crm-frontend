import { mapHeader } from "./header.mapper";
import { mapBody } from "./body.mapper";
import { mapFooter } from "./footer.mapper";
import { mapButtons } from "./button.mapper";
import type { TemplateState } from "../../../types/template.type";

export const mapTemplateToPayload = (state: TemplateState) => {
  const components = [
    mapHeader(state),
    mapBody(state),
    mapFooter(state),
    mapButtons(state.buttons),
  ].filter(Boolean);

  return {
    name: state.templateName,
    language: state.language,
    category: state.category.toUpperCase(),
    parameter_format: state.variableType === "Number" ? "POSITIONAL" : "NAMED",
    components,
  };
};
