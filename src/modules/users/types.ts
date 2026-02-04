import z from "zod";
import { createUserSchema, updateUserSchema, userPublicSchema } from "./schema";

export type CreateUser = z.infer<typeof createUserSchema>;

export type User = z.infer<typeof userPublicSchema>;

export type UpdateUser = z.infer<typeof updateUserSchema>;
