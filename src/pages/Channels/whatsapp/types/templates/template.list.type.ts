import { z } from "zod";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_STATUS,
  VARIABLE_TYPES,
} from "./template.enums";
import {
  // ButtonSchema,
  MetaTemplateButtonSchema,
} from "./template-button.schema";

/** Preview helper shape (legacy). */
export const TemplateVariableMappingSchema = z.object({
  variable: z.string().optional(),
  value: z.string().optional(),
  position: z.number().optional(),
});

/** Kyra CRM field mapping stored on the template document. */
export const KyraVariableMappingSchema = z.object({
  variable: z.string(),
  component: z.enum(["HEADER", "BODY", "BUTTONS"]),
  sourceType: z.enum([
    "CONTACT",
    "LEAD",
    "BOOKING",
    "CUSTOM",
    "STATIC",
    "API",
  ]),
  sourceKey: z.string().nullable(),
  fallbackValue: z.string().default(""),
});

const TemplateExampleSchema = z.object({
  header_text: z.array(z.string()).optional(),
  body_text: z.array(z.array(z.string())).optional(),
  body_text_named_params: z
    .array(
      z.object({
        param_name: z.string(),
        example: z.string(),
      }),
    )
    .optional(),

  header_text_named_params: z
    .array(
      z.object({
        param_name: z.string(),
        example: z.string(),
      }),
    )
    .optional(),
});

const HeaderComponentSchema = z.object({
  type: z.literal("HEADER"),
  format: z.string().optional(),
  text: z.string().optional(),
  example: TemplateExampleSchema.optional(),
  media: z
    .object({
      link: z.string().optional(),
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
    })
    .optional(),
  // Legacy / ignored — mappings live on the template document, not Meta components
  variableMappings: z.array(TemplateVariableMappingSchema).optional(),
});

const BodyComponentSchema = z.object({
  type: z.literal("BODY"),

  text: z.string(),

  example: TemplateExampleSchema.optional(),

  variableMappings: z.array(TemplateVariableMappingSchema).optional(),
});

const FooterComponentSchema = z.object({
  type: z.literal("FOOTER"),
  text: z.string(),
});

const ButtonsComponentSchema = z.object({
  type: z.literal("BUTTONS"),
  buttons: z.array(MetaTemplateButtonSchema).default([]),
  variableMappings: z.array(TemplateVariableMappingSchema).optional(),
});

const CarouselComponentSchema = z.object({
  type: z.literal("CAROUSEL"),
  cards: z
    .array(
      z.object({
        components: z.array(
          z.union([
            HeaderComponentSchema,
            BodyComponentSchema,
            ButtonsComponentSchema,
          ]),
        ),
      }),
    )
    .default([]),
});

export const TemplateComponentSchema = z.discriminatedUnion("type", [
  HeaderComponentSchema,
  BodyComponentSchema,
  FooterComponentSchema,
  ButtonsComponentSchema,
  CarouselComponentSchema,
]);

export const TemplateListItemSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  integrationId: z.string().optional(),
  whatsappAccountId: z.string().optional(),

  wabaId: z.string(),
  phoneNumberId: z.string(),

  metaTemplateId: z.string(),

  name: z.string(),

  language: z.string(),
  createdAt: z.string(),
  lastUsedAt: z.string(),
  isFavourite: z.boolean(),

  category: z.enum(TEMPLATE_CATEGORIES),

  parameterFormat: z.enum(VARIABLE_TYPES),
  status: z.enum(TEMPLATE_STATUS),
  components: z.array(TemplateComponentSchema),
  variableMappings: z.array(KyraVariableMappingSchema).optional().default([]),
});

export type TTemplate = z.infer<typeof TemplateListItemSchema>;
export type TTemplateComponent = z.infer<typeof TemplateComponentSchema>;
