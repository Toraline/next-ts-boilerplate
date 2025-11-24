import { z } from "zod";
import { createPermissionSchema, permissionPublicSchema, updatePermissionSchema } from "./schema";

export type createPermission = z.infer<typeof createPermissionSchema>;

export type Permission = z.infer<typeof permissionPublicSchema>;

export type UpdatePermission = z.infer<typeof updatePermissionSchema>;
