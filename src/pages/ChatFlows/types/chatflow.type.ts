import { z } from "zod";

export const chatFlowStatusSchema = z.enum(["draft", "published", "archived"]);

export const chatFlowSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Flow name is required"),
  description: z.string().optional(),
  status: chatFlowStatusSchema,
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
  version: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TChatFlowStatus = z.infer<typeof chatFlowStatusSchema>;
export type TChatFlow = z.infer<typeof chatFlowSchema>;
