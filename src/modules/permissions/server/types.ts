import { z } from "zod";
import {
  createPermissionSchema,
  listPermissionsQuerySchema,
  listPermissionsResponseSchema,
  permissionPublicSchema,
  permissionsListFiltersSchema,
} from "../schema";

export type CreatePermission = z.infer<typeof createPermissionSchema>;

export type Permission = z.infer<typeof permissionPublicSchema>;

export type ListPermissionsResponse = z.infer<typeof listPermissionsResponseSchema>;

export type ListPermissionsQuery = z.infer<typeof listPermissionsQuerySchema>;

export type PermissionsListFilters = z.infer<typeof permissionsListFiltersSchema>;
