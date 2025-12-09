import z from "zod";
import { createRoleSchema, rolePublicSchema, updateRoleSchema } from "./schema";

export type UpdateRole = z.infer<typeof updateRoleSchema>;

export type Role = z.infer<typeof rolePublicSchema>;

export type CreateRole = z.infer<typeof createRoleSchema>;
