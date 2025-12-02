import { z } from "zod";

export const TeamSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string(), // "admin" | "manager" | "member", etc.
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Auto TS type from Zod
export type ITeam = z.infer<typeof TeamSchema>;
