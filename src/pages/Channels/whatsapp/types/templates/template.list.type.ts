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

export const TemplateVariableMappingSchema = z.object({
  variable: z.string(),
  value: z.string(),
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
  variableMappings: z
    .array(TemplateVariableMappingSchema)
    .default([])
    .optional(),
});

const BodyComponentSchema = z.object({
  type: z.literal("BODY"),

  text: z.string(),

  example: TemplateExampleSchema.optional(),

  variableMappings: z.array(TemplateVariableMappingSchema).default([]),
});

const FooterComponentSchema = z.object({
  type: z.literal("FOOTER"),
  text: z.string(),
});

const ButtonsComponentSchema = z.object({
  type: z.literal("BUTTONS"),
  buttons: z.array(MetaTemplateButtonSchema).default([]),
  variableMappings: z.array(TemplateVariableMappingSchema).default([]),
});

export const TemplateComponentSchema = z.discriminatedUnion("type", [
  HeaderComponentSchema,
  BodyComponentSchema,
  FooterComponentSchema,
  ButtonsComponentSchema,
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
});

export type TTemplate = z.infer<typeof TemplateListItemSchema>;
export type TTemplateComponent = z.infer<typeof TemplateComponentSchema>;
