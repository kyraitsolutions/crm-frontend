import { VARIABLE_LIBRARY } from "../../../constants/template.constants";
import type { TemplateForm } from "../../../validations/template.schema";

export type TKyraVariableMapping = {
  variable: string;
  component: "HEADER" | "BODY" | "BUTTONS";
  sourceType: "CONTACT" | "LEAD" | "BOOKING" | "CUSTOM" | "STATIC" | "API";
  sourceKey: string | null;
  fallbackValue: string;
};

const CONTACT_KEYS = new Set([
  "customer_name",
  "customer_phone",
  "customer_email",
  "company_name",
  "delivery_address",
]);

const BOOKING_KEYS = new Set(["order_id", "order_date", "tracking_number", "amount"]);

function resolveSource(name?: string): Pick<
  TKyraVariableMapping,
  "sourceType" | "sourceKey"
> {
  const key = name?.trim() || "";
  if (!key) {
    return { sourceType: "STATIC", sourceKey: null };
  }

  if (CONTACT_KEYS.has(key) || key.startsWith("customer_")) {
    return { sourceType: "CONTACT", sourceKey: key };
  }

  if (BOOKING_KEYS.has(key)) {
    return { sourceType: "BOOKING", sourceKey: key };
  }

  if (VARIABLE_LIBRARY.includes(key)) {
    return { sourceType: "CUSTOM", sourceKey: key };
  }

  return { sourceType: "CUSTOM", sourceKey: key };
}

/**
 * Kyra-only mappings used when sending templates later.
 * Never include these inside Meta `components`.
 */
export function mapVariableMappings(
  state: Pick<
    TemplateForm,
    "variableType" | "headerVariables" | "bodyVariables"
  >,
): TKyraVariableMapping[] {
  const mappings: TKyraVariableMapping[] = [];

  state.headerVariables.forEach((variable, index) => {
    const key =
      state.variableType === "Name"
        ? variable.name?.trim() || `header_${index + 1}`
        : String(index + 1);
    const source = resolveSource(variable.name);

    mappings.push({
      variable: key,
      component: "HEADER",
      sourceType: source.sourceType,
      sourceKey: source.sourceKey,
      fallbackValue: variable.exampleValue || "",
    });
  });

  state.bodyVariables.forEach((variable, index) => {
    const key =
      state.variableType === "Name"
        ? variable.name?.trim() || String(index + 1)
        : String(index + 1);
    const source = resolveSource(variable.name);

    mappings.push({
      variable: key,
      component: "BODY",
      sourceType: source.sourceType,
      sourceKey: source.sourceKey,
      fallbackValue: variable.exampleValue || "",
    });
  });

  return mappings;
}
