// import { z } from "zod";
// import {
//   HEADER_TYPES,
//   TEMPLATE_CATEGORIES,
//   TEMPLATE_TYPES,
//   VARIABLE_TYPES,
// } from "./template.enums";

// import { ButtonSchema } from "./template-button.schema";

// export const TemplateVariableSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   exampleValue: z.string(),
// });

// export const HeaderMediaSchema = z.object({
//   file: z.instanceof(File),
//   previewUrl: z.string(),
//   mimeType: z.string(),
//   size: z.number(),
// });

// export const TemplateComponentSchema = z
//   .object({
//     type: z.string(),
//   })
//   .catchall(z.unknown());

// export const TemplateTypeOptionSchema = z.object({
//   value: z.enum(TEMPLATE_TYPES),
//   title: z.string(),
//   description: z.string(),
// });

// export const TemplateSchema = z.object({
//   templateName: z.string(),
//   category: z.enum(TEMPLATE_CATEGORIES),
//   language: z.string(),
//   templateType: z.enum(TEMPLATE_TYPES),

//   // Header
//   headerType: z.enum(HEADER_TYPES),
//   headerText: z.string(),
//   headerMedia: HeaderMediaSchema.optional(),
//   headerVariables: z.array(TemplateVariableSchema),

//   // Body
//   bodyText: z.string(),
//   bodyVariables: z.array(TemplateVariableSchema),

//   // Footer
//   footerText: z.string(),

//   variableType: z.enum(VARIABLE_TYPES),

//   // Buttons
//   buttons: z.array(ButtonSchema),
// });

// export type Template = z.infer<typeof TemplateSchema>;

// export type TemplateVariable = z.infer<typeof TemplateVariableSchema>;

// export type TemplateHeaderMedia = z.infer<typeof HeaderMediaSchema>;

// export type TemplateComponent = z.infer<typeof TemplateComponentSchema>;

// export type TemplateTypeOption = z.infer<typeof TemplateTypeOptionSchema>;
