import type { TemplateForm } from "../../../validations/template.schema";
import { isAuthenticationTemplate } from "../auth.utils";
import { mapAuthenticationPayload } from "./auth.mapper";
import { mapBody } from "./body.mapper";
import { mapButtons } from "./button.mapper";
import { mapCarousel } from "./carousel.mapper";
import { mapFooter } from "./footer.mapper";
import { mapHeader } from "./header.mapper";
import { mapVariableMappings } from "./variable-mapping.mapper";

export const mapTemplateToPayload = (state: TemplateForm) => {
  if (isAuthenticationTemplate(state)) {
    const authPayload = mapAuthenticationPayload(state);
    if (!authPayload) {
      throw new Error("Authentication settings are required");
    }
    return authPayload;
  }

  const isCarousel = state.templateType === "CAROUSEL";

  const components = isCarousel
    ? [mapBody(state), mapCarousel(state)].filter(Boolean)
    : [
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
    variableMappings: mapVariableMappings(state),
  };
};
