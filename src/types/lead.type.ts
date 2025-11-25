import { z } from "zod";

export const LeadSchema = z.object({
  _id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().optional(), // can be empty string
  phone: z.string().optional(),
  customFields: z.record(z.string(), z.any()).optional(), // empty object allowed
  stage: z.string().min(1),
  status: z.string().min(1),
  source: z.object({
    name: z.string().min(1),
  }),
  tags: z.array(z.any()).optional(), // can refine later if needed
  notes: z.array(z.any()).optional(),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
});

export type ILead = z.infer<typeof LeadSchema>;
