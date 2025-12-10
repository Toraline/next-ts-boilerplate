import z from "zod";
import {
  listRolesQuerySchema,
  listRolesResponseSchema,
  rolePublicSchema,
  rolesListFiltersSchema,
} from "./schema";

export type ListRolesQuery = z.infer<typeof listRolesQuerySchema>;

export type ListRolesResponse = z.infer<typeof listRolesResponseSchema>;

export type Role = z.infer<typeof rolePublicSchema>;

export type RolesListFilters = z.infer<typeof rolesListFiltersSchema>;
