import z from "zod";
import { createRoleSchema, rolePublicSchema } from "./schema";

export type CreateRole = z.infer<typeof createRoleSchema>;

export type Role = z.infer<typeof rolePublicSchema>;
