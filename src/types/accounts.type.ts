import { z } from "zod";

export const AccountStatusEnum = z.enum(["active", "inactive", "suspended"]);

export const AccountSchema = z.object({
  id: z.string().min(1, "Account id is required"),

  accountName: z.string().min(2, "Account name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  status: AccountStatusEnum,

  createdAt: z.string().datetime({ message: "Invalid ISO date string" }),
});

export type IAccount = z.infer<typeof AccountSchema>;
