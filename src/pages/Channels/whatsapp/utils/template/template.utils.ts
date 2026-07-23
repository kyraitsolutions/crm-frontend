import { generateId } from "@/utils/generateId.utils";
import { BUTTON_TYPE_CONFIG } from "../../constants/template.constants";
import type { ButtonKind, TemplateButton } from "../../types/template.type";

export interface ButtonValidationError {
  buttonId?: string;
  message: string;
}
export function validateButtons(
  buttons: TemplateButton[],
): ButtonValidationError[] {
  const errors: ButtonValidationError[] = [];

  if (buttons.length > 10) {
    errors.push({ message: "You can add a maximum of 10 buttons." });
  }

  const countByKind: Record<string, number> = {};
  buttons.forEach((b) => {
    countByKind[b.kind] = (countByKind[b.kind] ?? 0) + 1;
  });

  Object.entries(countByKind).forEach(([kind, count]) => {
    const config = BUTTON_TYPE_CONFIG[kind as keyof typeof BUTTON_TYPE_CONFIG];
    if (config && count > config.maxCount) {
      errors.push({
        message: `${config.label} allows a maximum of ${config.maxCount} button${
          config.maxCount > 1 ? "s" : ""
        }.`,
      });
    }
  });

  const hasStandalone = buttons.some(
    (b) => BUTTON_TYPE_CONFIG[b.kind]?.standaloneOnly,
  );
  if (hasStandalone && buttons.length > 1) {
    const standaloneBtn = buttons.find(
      (b) => BUTTON_TYPE_CONFIG[b.kind]?.standaloneOnly,
    )!;
    errors.push({
      message: `${BUTTON_TYPE_CONFIG[standaloneBtn.kind].label} can't be combined with other buttons.`,
    });
  }

  const seenByKind = new Map<string, Set<string>>();
  buttons.forEach((b) => {
    const normalized = b.label.trim().toLowerCase();
    if (!normalized) return;
    const set = seenByKind.get(b.kind) ?? new Set<string>();
    if (set.has(normalized)) {
      errors.push({
        buttonId: b.id,
        message: "You can't enter the same text for multiple buttons.",
      });
    }
    set.add(normalized);
    seenByKind.set(b.kind, set);
  });

  return errors;
}
export function createButton(kind: ButtonKind): TemplateButton {
  switch (kind) {
    case "QUICK_REPLY":
      return {
        id: generateId(),
        kind,
        label: "",
      };

    case "URL":
      return {
        id: generateId(),
        kind,
        label: "",
        url: "",
        urlType: "STATIC",
        trackConversions: false,
      };

    case "PHONE_NUMBER":
      return {
        id: generateId(),
        kind,
        label: "",
        countryCode: "",
        country: "IN",
        phoneNumber: "",
      };

    case "CALL_ON_WHATSAPP":
      return {
        id: generateId(),
        kind,
        label: "",
        activeFor: "7_DAYS",
      };

    case "COPY_CODE":
      return {
        id: generateId(),
        kind,
        label: "",
        offerCode: "",
      };

    case "SHARE_CONTACT":
      return {
        id: generateId(),
        kind,
        label: "",
      };
  }
}

export const CALL_TO_ACTION_BUTTONS: ButtonKind[] = [
  "URL",
  "PHONE_NUMBER",
  "CALL_ON_WHATSAPP",
  "COPY_CODE",
  "SHARE_CONTACT",
];

export const QUICK_REPLY_BUTTONS: ButtonKind[] = ["QUICK_REPLY"];

export function groupButtons(buttons: TemplateButton[]) {
  return {
    callToAction: buttons.filter((button) =>
      CALL_TO_ACTION_BUTTONS.includes(button.kind),
    ),

    quickReply: buttons.filter((button) =>
      QUICK_REPLY_BUTTONS.includes(button.kind),
    ),
  };
}
