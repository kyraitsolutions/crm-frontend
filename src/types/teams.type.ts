import { z } from "zod";

export const TeamSchema = z.object({
  id: z.string(),
  userId: z.string(),
  role: z.object({ id: z.string(), name: z.string() }),
  userProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    profilePicture: z.string().optional(),
    phone: z.string().optional(),
  }),
  email: z.email(),
  status: z.boolean().optional(),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(),
  accounts: z.array(
    z.object({ accountId: z.string(), roleId: z.string(), name: z.string() }),
  ),
});

export type ITeam = z.infer<typeof TeamSchema>;
