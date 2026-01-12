import z from "zod";
import { createUserSchema, userPublicSchema } from "./schema";

export type CreateUser = z.infer<typeof createUserSchema>;

export type User = z.infer<typeof userPublicSchema>;
