import { z } from "zod";
import { BUTTON_KINDS, URL_TYPES, WHATSAPP_ACTIVE_FOR } from "./template.enums";

export const ButtonErrorsSchema = z.object({
  label: z.string().optional(),
  url: z.string().optional(),
  phoneNumber: z.string().optional(),
  countryCode: z.string().optional(),
  offerCode: z.string().optional(),
});

export const ButtonSchema = z.object({
  id: z.string(),
  kind: z.enum(BUTTON_KINDS),
  label: z.string(),
  url: z.string().optional(),
  urlType: z.enum(URL_TYPES).optional(),
  trackConversions: z.boolean().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  activeFor: z.enum(WHATSAPP_ACTIVE_FOR).optional(),
  offerCode: z.string().optional(),
  errors: ButtonErrorsSchema.optional(),
});

export type ButtonErrors = z.infer<typeof ButtonErrorsSchema>;

export type TemplateButton = z.infer<typeof ButtonSchema>;
