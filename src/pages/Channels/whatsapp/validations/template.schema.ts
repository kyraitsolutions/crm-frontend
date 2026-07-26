// validation/template.schema.ts
import { z } from "zod";

export const templateSchema = z
  .object({
    // Template Details
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

    // Header
    headerType: z.string(),
    headerText: z.string(),
    headerVariables: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        exampleValue: z.string(),
      }),
    ),
    headerMedia: z.any().optional(),

    // Body
    bodyText: z
      .string()
      .trim()
      .min(1, "Body text is required")
      .min(10, "Body text must be at least 10 characters")
      .max(1024, "Body text cannot exceed 1024 characters"),
    bodyVariables: z.array(
      z.object({
        id: z.string(),
        name: z.string().trim().optional(),
        exampleValue: z.string().trim().min(1, "Example value is required"),
      }),
    ),

    // Footer
    footerText: z.string(),

    // Variables
    variableType: z.enum(["Number", "Name"]),

    // Buttons
    buttons: z.array(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
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

    const body = data.bodyText.trim();

    // Starts with {{...}}
    if (/^\{\{.*?\}\}/.test(body)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A variable cannot be at the beginning of the message.",
        path: ["bodyText"],
      });
    }

    // Ends with {{...}}
    if (/\{\{.*?\}\}.$/.test(body)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A variable cannot be at the end of the message.",
        path: ["bodyText"],
      });
    }
  });

export type TemplateForm = z.infer<typeof templateSchema>;
