import { ConflictError, NotFoundError } from "lib/http/errors";
import { recordAuditLog, resolveAuditActor } from "modules/audit";
import type { AuditActor } from "modules/audit";
import {
  createPermissionSchema,
  listPermissionsQuerySchema,
  listPermissionsResponseSchema,
  permissionEntitySchema,
  permissionPublicSchema,
  updatePermissionSchema,
} from "../schema";
import * as permissionRepo from "./repo";

function mapPermissionToPublic(raw: unknown) {
  const entity = permissionEntitySchema.parse(raw);

  return permissionPublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  });
}

type ServiceOptions = {
  actor?: AuditActor;
};

function auditActor(options?: ServiceOptions) {
  return resolveAuditActor(options?.actor);
}

export async function createPermission(raw: unknown, options?: ServiceOptions) {
  const payload = createPermissionSchema.parse(raw);
  const key = payload.key.trim();

  const existing = await permissionRepo.permissionByKey(key);
  if (existing) throw new ConflictError("Permission key already exists");

  const created = await permissionRepo.permissionCreate({
    key,
    name: payload.name.trim(),
    description:
      typeof payload.description === "string"
        ? payload.description.trim()
        : (payload.description ?? null),
  });

  const permission = mapPermissionToPublic(created);

  await recordAuditLog({
    ...auditActor(options),
    action: "permission.created",
    targetType: "permission",
    targetId: permission.id,
    metadata: { permission },
  });

  return permission;
}

export async function listPermissions(rawQuery: unknown) {
  const query = listPermissionsQuerySchema.parse(rawQuery);

  const { items, total, page, pageSize } = await permissionRepo.permissionFindMany(query);

  const permissions = items.map(mapPermissionToPublic);

  return listPermissionsResponseSchema.parse({
    items: permissions,
    total,
    page,
    pageSize,
  });
}

export async function getPermissionById(id: string) {
  const permission = await permissionRepo.permissionById(id);
  if (!permission) throw new NotFoundError("Permission not found");

  return mapPermissionToPublic(permission);
}

export async function updatePermission(id: string, raw: unknown, options?: ServiceOptions) {
  const payload = updatePermissionSchema.parse(raw);

  const permission = await permissionRepo.permissionById(id);
  if (!permission) throw new NotFoundError("Permission not found");

  const before = mapPermissionToPublic(permission);

  const updates: Record<string, unknown> = {};

  if (typeof payload.name !== "undefined") {
    updates.name = payload.name.trim();
  }

  if (typeof payload.description !== "undefined") {
    updates.description =
      typeof payload.description === "string"
        ? payload.description.trim()
        : (payload.description ?? null);
  }

  if (Object.keys(updates).length) {
    await permissionRepo.permissionUpdate(id, updates);
  }

  const updated = await getPermissionById(id);

  await recordAuditLog({
    ...auditActor(options),
    action: "permission.updated",
    targetType: "permission",
    targetId: updated.id,
    metadata: { before, after: updated },
  });

  return updated;
}

export async function deletePermission(id: string, options?: ServiceOptions) {
  const permission = await permissionRepo.permissionById(id);
  if (!permission) throw new NotFoundError("Permission not found");

  const before = mapPermissionToPublic(permission);

  await permissionRepo.permissionDelete(id);

  await recordAuditLog({
    ...auditActor(options),
    action: "permission.deleted",
    targetType: "permission",
    targetId: id,
    metadata: { permission: before },
  });
}
