import { z } from "zod";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_STATUS,
  VARIABLE_TYPES,
} from "./template.enums";

export const TemplateVariableMappingSchema = z.object({
  variable: z.string(),
  value: z.string(),
});

export const TemplateComponentSchema = z.object({
  type: z.enum(["header", "body", "footer"]),
  text: z.string().optional(),
  format: z.string().optional(),
  variableMappings: z.array(TemplateVariableMappingSchema).default([]),
});

export const TemplateListItemSchema = z.object({
  id:z.string(),
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
  isFavourite:z.boolean(),

  category: z.enum(TEMPLATE_CATEGORIES),

  parameterFormat: z.enum(VARIABLE_TYPES),
  status: z.enum(TEMPLATE_STATUS),
  components: z.array(TemplateComponentSchema),
});

export type TTemplate = z.infer<typeof TemplateListItemSchema>;
