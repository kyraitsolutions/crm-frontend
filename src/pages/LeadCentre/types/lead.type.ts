import { z } from "zod";

export type Path<T> = {
  [K in keyof T & string]:
    NonNullable<T[K]> extends object
      ? K | `${K}.${Path<NonNullable<T[K]>>}`
      : K;
}[keyof T & string];
export const LeadSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  profileImage: z.string().optional(),
  name: z.string().min(1),
  email: z.string().optional(), // can be empty string
  phone: z.string().optional(),
  message: z.string().optional(),
  description: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  website: z.string().optional(),
  mobile: z.string().optional(),
  customFields: z.record(z.string(), z.any()).optional(), // empty object allowed
  stage: z.string().min(1),
  status: z.string().min(1),
  source: z.object({
    name: z.string().min(1),
    url: z.string().optional(),
    formId: z.string().optional(),
    chatbotId: z.string().optional(),
  }),
  assignedTo: z.object({
    userId: z.string().min(1),
    firstName: z.string().min(1),
    profilePicture: z.string(),
  }),
  tags: z.array(z.any()).optional(), // can refine later if needed
  notes: z
    .array(
      z.object({
        activitySource: z.enum([
          "phone_call",
          "message",
          "note",
          "email",
          "whatsapp",
        ]),
        attachment: z.string(),
        message: z.string(),
        createdBy: z.string().optional(),
        createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date",
        }),
      }),
    )
    .optional(),
  emails: z.array(z.any()).optional(),
  attachments: z.array(z.string()).optional(),
  meta: z
    .object({
      ip: z.string().optional(),
      userAgent: z.string().optional(),
      location: z
        .object({
          address: z.string().optional(),
          country: z.string().optional(),
          city: z.string().optional(),
          coordinates: z
            .object({
              lat: z.number().nullable().optional(),
              lng: z.number().nullable().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
});

export const BasicNumberSchema = z.object({
  intakeLeads: z.number(),
  qualifiedLeads: z.number(),
  conversionRate: z.number(),
  convertedLeads: z.number(),
});

export const CreateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().optional(), // can be empty string
  phone: z.string().optional(),
  message: z.string().optional(),
  description: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  website: z.string().optional(),
  mobile: z.string().optional(),
  customFields: z.record(z.string(), z.any()).optional(), // empty object allowed
  stage: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  source: z
    .object({
      name: z.string().min(1).optional(),
      url: z.string().optional(),
      formId: z.string().optional(),
      chatbotId: z.string().optional(),
    })
    .optional(),
  tags: z.array(z.any()).optional(),
  notes: z
    .array(
      z.object({
        activitySource: z
          .enum(["phone_call", "message", "note", "email", "whatsapp"])
          .optional(),
        attachment: z.string().optional(),
        message: z.string().optional(),
        createdBy: z.string().optional(),
        createdAt: z
          .string()
          .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
          .optional(),
      }),
    )
    .optional(),
});

export type ILead = z.infer<typeof LeadSchema>;
export type BasicNumber = z.infer<typeof BasicNumberSchema>;
export type ICreateLead = z.infer<typeof CreateLeadSchema>;
