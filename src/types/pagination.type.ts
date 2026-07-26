import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),

  totalPages: z.number(),

  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
