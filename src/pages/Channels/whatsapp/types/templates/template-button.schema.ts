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
  countryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  activeFor: z.enum(WHATSAPP_ACTIVE_FOR).optional(),
  offerCode: z.string().optional(),
  errors: ButtonErrorsSchema.optional(),
  value: z.string().optional(),
});

export const MetaTemplateButtonSchema = z.object({
  type: z.enum(BUTTON_KINDS),
  text: z.string(),
  url: z.string().optional(),
  phone_number: z.string().optional(),
  example: z.string().optional(),
  voice_call: z.enum(WHATSAPP_ACTIVE_FOR).optional(),
});

export type ButtonErrors = z.infer<typeof ButtonErrorsSchema>;
export type TTemplateButton = z.infer<typeof ButtonSchema>;
export type TMetaTemplateButton = z.infer<typeof MetaTemplateButtonSchema>;
