// validation/template.schema.ts
import { z } from "zod";
import {
  AUTH_CODE_EXPIRATION_MAX,
  AUTH_CODE_EXPIRATION_MIN,
  CAROUSEL_CARD_BODY_MAX,
  CAROUSEL_MAX_CARDS,
  CAROUSEL_MIN_CARDS,
} from "../constants/template.constants";

const carouselMediaSchema = z.object({
  previewUrl: z.string().min(1),
  name: z.string().min(1),
  size: z.number().positive(),
  mimeType: z.string().min(1),
});

const carouselCardSchema = z.object({
  id: z.string(),
  media: carouselMediaSchema.optional(),
  bodyText: z.string().optional(),
  buttons: z.array(z.any()).max(2),
});

export const carouselSchema = z.object({
  mediaFormat: z.enum(["IMAGE", "VIDEO"]),
  includeCardBody: z.boolean(),
  cards: z.array(carouselCardSchema),
});

export const authenticationSchema = z.object({
  otpType: z.literal("COPY_CODE"),
  addSecurityRecommendation: z.boolean(),
  addCodeExpiration: z.boolean(),
  codeExpirationMinutes: z.number().int(),
  customValidityPeriod: z.boolean(),
  messageSendTtlMinutes: z.number().int(),
  copyCodeButtonText: z.string().max(25).optional(),
});

export const templateSchema = z
  .object({
    templateName: z
      .string()
      .trim()
      .min(1, "Template name is required")
      .min(3, "Template name must be at least 3 characters")
      .max(512, "Template name cannot exceed 512 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Only lowercase letters, numbers and underscores are allowed",
      ),

    language: z.string().trim().min(1, "Language is required"),
    category: z.string().trim().min(1, "Category is required"),
    templateType: z.string().trim().min(1, "Template type is required"),

    headerType: z.string(),
    headerText: z.string(),
    headerVariables: z.array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        exampleValue: z.string().trim().min(1, "Example value is required"),
      }),
    ),
    headerMedia: z.any().optional(),

    bodyText: z.string().max(1024, "Body text cannot exceed 1024 characters"),
    bodyVariables: z.array(
      z.object({
        id: z.string(),
        name: z.string().trim().optional(),
        exampleValue: z.string().trim().min(1, "Example value is required"),
      }),
    ),

    footerText: z.string(),
    variableType: z.enum(["Number", "Name"]),
    buttons: z.array(z.any()).optional(),
    carousel: carouselSchema.optional(),
    authentication: authenticationSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const isAuth =
      data.category === "Authentication" ||
      data.templateType === "AUTHENTICATION";

    if (isAuth) {
      if (!data.authentication) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Authentication settings are required",
          path: ["authentication"],
        });
        return;
      }

      if (data.authentication.otpType !== "COPY_CODE") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only Copy code is supported",
          path: ["authentication", "otpType"],
        });
      }

      if (data.authentication.addCodeExpiration) {
        const minutes = data.authentication.codeExpirationMinutes;
        if (
          minutes < AUTH_CODE_EXPIRATION_MIN ||
          minutes > AUTH_CODE_EXPIRATION_MAX
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Expiry must be ${AUTH_CODE_EXPIRATION_MIN}–${AUTH_CODE_EXPIRATION_MAX} minutes`,
            path: ["authentication", "codeExpirationMinutes"],
          });
        }
      }

      if (
        data.authentication.customValidityPeriod &&
        data.authentication.messageSendTtlMinutes < 1
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Validity period is required",
          path: ["authentication", "messageSendTtlMinutes"],
        });
      }

      return;
    }

    const body = data.bodyText.trim();
    if (!body) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Body text is required",
        path: ["bodyText"],
      });
    } else if (body.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Body text must be at least 10 characters",
        path: ["bodyText"],
      });
    }

    if (data.variableType === "Name") {
      data.bodyVariables.forEach((variable, index) => {
        if (!variable.name?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Variable name is required",
            path: ["bodyVariables", index, "name"],
          });
        }
      });
    }

    if (/^\{\{.*?\}\}/.test(body)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A variable cannot be at the beginning of the message.",
        path: ["bodyText"],
      });
    }

    if (/\{\{.*?\}\}$/.test(body)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A variable cannot be at the end of the message.",
        path: ["bodyText"],
      });
    }

    if (data.templateType !== "CAROUSEL") return;

    if (data.category !== "Marketing") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Carousel templates are only available for Marketing.",
        path: ["category"],
      });
    }

    const carousel = data.carousel;
    if (!carousel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Carousel cards are required",
        path: ["carousel"],
      });
      return;
    }

    if (
      carousel.cards.length < CAROUSEL_MIN_CARDS ||
      carousel.cards.length > CAROUSEL_MAX_CARDS
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Carousel requires ${CAROUSEL_MIN_CARDS}–${CAROUSEL_MAX_CARDS} cards.`,
        path: ["carousel", "cards"],
      });
    }

    const structureKinds = (carousel.cards[0]?.buttons || []).map(
      (button: { kind?: string }) => button.kind,
    );

    carousel.cards.forEach((card, cardIndex) => {
      if (!card.media?.previewUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card media is required",
          path: ["carousel", "cards", cardIndex, "media"],
        });
      }

      const cardKinds = (card.buttons || []).map(
        (button: { kind?: string }) => button.kind,
      );
      if (
        cardKinds.length !== structureKinds.length ||
        cardKinds.some((kind, index) => kind !== structureKinds[index])
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "All carousel cards must use the same button types",
          path: ["carousel", "cards", cardIndex, "buttons"],
        });
      }

      if (carousel.includeCardBody) {
        const cardBody = card.bodyText?.trim() ?? "";
        if (!cardBody) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Card body is required on all cards when enabled",
            path: ["carousel", "cards", cardIndex, "bodyText"],
          });
        } else if (cardBody.length > CAROUSEL_CARD_BODY_MAX) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Card body cannot exceed ${CAROUSEL_CARD_BODY_MAX} characters`,
            path: ["carousel", "cards", cardIndex, "bodyText"],
          });
        }
      }

      card.buttons.forEach((button: any, buttonIndex: number) => {
        if (!button.label?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Button label is required",
            path: [
              "carousel",
              "cards",
              cardIndex,
              "buttons",
              buttonIndex,
              "label",
            ],
          });
        } else if (button.label.length > 25) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Button label cannot exceed 25 characters",
            path: [
              "carousel",
              "cards",
              cardIndex,
              "buttons",
              buttonIndex,
              "label",
            ],
          });
        }

        if (button.kind === "URL" && !button.url?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "URL is required",
            path: [
              "carousel",
              "cards",
              cardIndex,
              "buttons",
              buttonIndex,
              "url",
            ],
          });
        }

        if (button.kind === "PHONE_NUMBER" && !button.phoneNumber?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Phone number is required",
            path: [
              "carousel",
              "cards",
              cardIndex,
              "buttons",
              buttonIndex,
              "phoneNumber",
            ],
          });
        }
      });
    });
  });

export type TemplateForm = z.infer<typeof templateSchema>;
