import type { TemplateForm } from "../../../validations/template.schema";

type CarouselPayload = {
  type: "CAROUSEL";
  cards: {
    components: Record<string, unknown>[];
  }[];
};

function mapCarouselButton(button: {
  kind: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
  label: string;
  url?: string;
  phoneNumber?: string;
  countryCode?: string;
}) {
  switch (button.kind) {
    case "QUICK_REPLY":
      return {
        type: "QUICK_REPLY",
        text: button.label,
      };
    case "URL":
      return {
        type: "URL",
        text: button.label,
        url: button.url,
      };
    case "PHONE_NUMBER":
      return {
        type: "PHONE_NUMBER",
        text: button.label,
        phone_number: `${button.countryCode || "+91"}${button.phoneNumber}`,
      };
    default:
      return null;
  }
}

export function mapCarousel(
  state: Pick<TemplateForm, "templateType" | "carousel">,
): CarouselPayload | null {
  if (state.templateType !== "CAROUSEL" || !state.carousel) {
    return null;
  }

  const { mediaFormat, includeCardBody, cards } = state.carousel;

  return {
    type: "CAROUSEL",
    cards: cards.map((card) => {
      const components: Record<string, unknown>[] = [
        {
          type: "HEADER",
          format: mediaFormat,
          media: {
            link: card.media?.previewUrl,
            name: card.media?.name,
            size: card.media?.size,
            mimeType: card.media?.mimeType,
          },
        },
      ];

      if (includeCardBody && card.bodyText?.trim()) {
        components.push({
          type: "BODY",
          text: card.bodyText.trim(),
        });
      }

      const buttons = card.buttons
        .map(mapCarouselButton)
        .filter((button): button is NonNullable<typeof button> =>
          Boolean(button),
        );

      if (buttons.length) {
        components.push({
          type: "BUTTONS",
          buttons,
        });
      }

      return { components };
    }),
  };
}
