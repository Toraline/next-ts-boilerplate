import { z } from "zod";
import { createPermissionSchema, permissionPublicSchema } from "../schema";

export type createPermission = z.infer<typeof createPermissionSchema>;

export type Permission = z.infer<typeof permissionPublicSchema>;
