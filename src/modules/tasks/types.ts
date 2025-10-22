import { createTaskSchema, taskPublicSchema } from "./schema";
import { z } from "zod";

export type CreateTask = z.infer<typeof createTaskSchema>;

export type Task = z.infer<typeof taskPublicSchema>;
