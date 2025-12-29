// export interface LeadFormListItem {
//   id: string;
//   formTitle: string;
//   formDescription: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface TLead {
//   _id: string;
//   accountId: string;
//   name: string;
//   email: string;
//   phone: string;
//   customFields: Record<string, any>;
//   stage: string;
//   status: string;
//   source: {
//     name: string;
//   };
//   tags: string[];
//   notes: string[];
//   createdAt: string; // or Date if you convert to Date object
//   updatedAt: string; // or Date if you convert to Date object
// }

import { z } from "zod";

export const CustomFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  required: z.boolean(),
});

export const LeadFormSchema = z.object({
  // id: z.string(),
  // userId: z.string(),
  // accountId: z.string(),

  // formTitle: z.string().min(1, "Form title is required"),
  // formDescription: z.string().optional(),
  // headerImage: z.string().optional(),

  // formName: z.string().min(1, "Form name is required"),

  // formFields: z.object({
  //   name: z.boolean(),
  //   phoneNumber: z.boolean(),
  //   email: z.boolean(),
  //   message: z.boolean(),
  //   customFields: z.array(CustomFieldSchema),
  // }),

  // successMessage: z.string().min(1, "Success message is required"),
  // successCTA: z.enum(["whatsapp", "email", "redirect"]),
  // successCTADestination: z.string().min(1, "CTA destination is required"),

  id: z.string(),
  formTitle: z.string(),
  formDescription: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LeadFormListItem = z.object({
  id: z.string(),
  formTitle: z.string(),
  formDescription: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ILeadFormListItem = z.infer<typeof LeadFormListItem>;

export type ILeadForm = z.infer<typeof LeadFormSchema>;
