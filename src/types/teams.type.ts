import { z } from "zod";

export const TeamSchema = z.object({
  id: z.string(),

  userId: z.string(),
  roleId: z.string(),

  firstName: z.string(),
  lastName: z.string(),

  email: z.email(),

  inviteStatus: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
  roleName: z.string(), // e.g. "TEAM_MEMBER"

  status: z.boolean(),

  accountIds: z.array(z.string()),

  createdAt: z.string(), // ISO date string
});

export type ITeam = z.infer<typeof TeamSchema>;
