import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const sortDirectionSchema = z.enum(["asc", "desc"]);

export function withPagination<T extends z.ZodRawShape>(shape: T) {
  return paginationSchema.extend(shape);
}
