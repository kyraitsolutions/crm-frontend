import { z } from "zod";

// ✅ Zod Schema
export const addTeamMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email("Invalid email").min(1, "Email is required"),
  roleId: z.string().optional(),
  accounts: z
    .array(
      z.object({
        accountId: z.string(),
        roleId: z.string(),
      }),
    )
    .min(1, "Select at least one account"),
});

// ✅ Type from schema (single source of truth)
export type AddTeamMemberFormValues = z.infer<typeof addTeamMemberSchema>;
