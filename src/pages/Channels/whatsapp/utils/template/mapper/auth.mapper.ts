import type { TemplateForm } from "../../../validations/template.schema";
import { isAuthenticationTemplate } from "../auth.utils";

export function mapAuthenticationComponents(state: TemplateForm) {
  const auth = state.authentication;
  if (!auth) return [];

  const components: Record<string, unknown>[] = [
    {
      type: "BODY",
      add_security_recommendation: Boolean(auth.addSecurityRecommendation),
    },
  ];

  if (auth.addCodeExpiration) {
    components.push({
      type: "FOOTER",
      code_expiration_minutes: auth.codeExpirationMinutes,
    });
  }

  // Meta create docs use lowercase otp_type; upsert examples use COPY_CODE.
  // Graph API accepts COPY_CODE for message_templates create.
  components.push({
    type: "BUTTONS",
    buttons: [
      {
        type: "OTP",
        otp_type: "COPY_CODE",
        ...(auth.copyCodeButtonText?.trim()
          ? { text: auth.copyCodeButtonText.trim().slice(0, 25) }
          : {}),
      },
    ],
  });

  return components;
}

export function mapAuthenticationPayload(state: TemplateForm) {
  if (!isAuthenticationTemplate(state) || !state.authentication) {
    return null;
  }

  const payload: Record<string, unknown> = {
    name: state.templateName,
    language: state.language,
    category: "AUTHENTICATION",
    components: mapAuthenticationComponents(state),
    variableMappings: [],
  };

  if (state.authentication.customValidityPeriod) {
    payload.message_send_ttl_seconds =
      state.authentication.messageSendTtlMinutes * 60;
  }

  return payload;
}
