import z from "zod";
import { createRoleSchema, rolePublicSchema, updateRoleSchema } from "./schema";
import { listRolesQuerySchema, listRolesResponseSchema, rolesListFiltersSchema } from "./schema";

export type UpdateRole = z.infer<typeof updateRoleSchema>;

export type Role = z.infer<typeof rolePublicSchema>;

export type CreateRole = z.infer<typeof createRoleSchema>;

export type ListRolesQuery = z.infer<typeof listRolesQuerySchema>;

export type ListRolesResponse = z.infer<typeof listRolesResponseSchema>;

export type RolesListFilters = z.infer<typeof rolesListFiltersSchema>;
