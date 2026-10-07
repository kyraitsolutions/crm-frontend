import type { TemplateForm } from "../../validations/template.schema";

export function createDefaultAuthentication(): NonNullable<
  TemplateForm["authentication"]
> {
  return {
    otpType: "COPY_CODE",
    addSecurityRecommendation: true,
    addCodeExpiration: true,
    codeExpirationMinutes: 10,
    customValidityPeriod: false,
    messageSendTtlMinutes: 10,
    copyCodeButtonText: "Copy Code",
  };
}

export function isAuthenticationTemplate(
  state: Pick<TemplateForm, "category" | "templateType">,
) {
  return (
    state.category === "Authentication" ||
    state.templateType === "AUTHENTICATION"
  );
}
