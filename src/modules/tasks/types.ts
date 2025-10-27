import {
  createTaskSchema,
  listTasksResponseSchema,
  listTasksQuerySchema,
  taskPublicSchema,
} from "./schema";
import { z } from "zod";

export type CreateTask = z.infer<typeof createTaskSchema>;

export type Task = z.infer<typeof taskPublicSchema>;

export type ListTasksResponse = z.infer<typeof listTasksResponseSchema>;

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
