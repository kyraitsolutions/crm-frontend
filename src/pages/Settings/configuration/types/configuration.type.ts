import { z } from "zod";
export const ConfigValueSchema = z.object({
  _id: z.string().optional(),
  key: z.string().trim().min(1, "Key is required").toLowerCase(),
  label: z.string().trim().min(1, "Label is required"),
  color: z.string().default("#6B7280"),
  order: z.number().int().nonnegative().default(0),
  system: z.boolean().default(false),
  editable: z.boolean().default(true),
  deletable: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).default({}),
});

export type TConfigValue = z.infer<typeof ConfigValueSchema>;
