import { Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "lib/http/errors";
import { AuditLogOptions, recordAuditLog, resolveAuditActorFromOptions } from "modules/audit";
import {
  createRoleSchema,
  listRolesQuerySchema,
  listRolesResponseSchema,
  permissionEntitySchema,
  roleEntitySchema,
  rolePublicSchema,
  updateRoleSchema,
  assignRolePermissionSchema,
  rolePermissionEntitySchema,
  rolePermissionPublicSchema,
  listRolePermissionsResponseSchema,
  rolePermissionAssignmentSchema,
} from "../schema";
import * as roleRepo from "./repo";

function mapPermissionToPublic(raw: unknown) {
  const entity = permissionEntitySchema.parse(raw);

  return {
    id: entity.id,
    key: entity.key,
    name: entity.name,
    description: entity.description,
  };
}

function mapRoleToPublic(raw: unknown) {
  const entity = roleEntitySchema
    .extend({
      permissions: rolePublicSchema.shape.permissions,
    })
    .parse(raw);

  return rolePublicSchema.parse({
    id: entity.id,
    key: entity.key,
    name: entity.name,
    description: entity.description,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    permissions: entity.permissions,
  });
}

export async function createRole(raw: unknown, options?: AuditLogOptions) {
  const payload = createRoleSchema.parse(raw);
  const key = payload.key.trim();

  const existing = await roleRepo.roleByKey(key);
  if (existing) throw new ConflictError("Role key already exists");

  const permissionIds = payload.permissionIds ?? [];
  const uniquePermissionIds = Array.from(new Set(permissionIds));

  if (uniquePermissionIds.length) {
    const permissions = await roleRepo.permissionsByIds(uniquePermissionIds);

    if (permissions.length !== uniquePermissionIds.length) {
      throw new NotFoundError("One or more permissions were not found");
    }
  }

  const created = await roleRepo.roleCreate({
    key,
    name: payload.name.trim(),
    description:
      typeof payload.description === "string"
        ? payload.description.trim()
        : (payload.description ?? null),
  });

  if (uniquePermissionIds.length) {
    await roleRepo.rolePermissionCreateMany(created.id, uniquePermissionIds);
  }

  const role = await roleRepo.roleById(created.id);
  if (!role) throw new NotFoundError("Role not found");

  const permissions = role.permissions.map(({ permission }) => mapPermissionToPublic(permission));

  const publicRole = mapRoleToPublic({
    ...role,
    permissions,
  });

  await recordAuditLog({
    ...resolveAuditActorFromOptions(options),
    action: "role.created",
    targetType: "role",
    targetId: publicRole.id,
    metadata: { role: publicRole },
  });

  return publicRole;
}

export async function listRoles(rawQuery: unknown) {
  const query = listRolesQuerySchema.parse(rawQuery);

  const { items, total, page, pageSize } = await roleRepo.roleFindMany(query);

  const roles = items.map((role) =>
    mapRoleToPublic({
      ...role,
      permissions: role.permissions.map(({ permission }) => mapPermissionToPublic(permission)),
    }),
  );

  return listRolesResponseSchema.parse({
    items: roles,
    total,
    page,
    pageSize,
  });
}

export async function getRoleById(id: string) {
  const role = await roleRepo.roleById(id);
  if (!role) throw new NotFoundError("Role not found");

  return mapRoleToPublic({
    ...role,
    permissions: role.permissions.map(({ permission }) => mapPermissionToPublic(permission)),
  });
}

export async function updateRole(id: string, raw: unknown, options?: AuditLogOptions) {
  const payload = updateRoleSchema.parse(raw);

  const role = await roleRepo.roleById(id);
  if (!role) throw new NotFoundError("Role not found");

  const before = mapRoleToPublic({
    ...role,
    permissions: role.permissions.map(({ permission }) => mapPermissionToPublic(permission)),
  });

  const updates: Prisma.RoleUpdateInput = {};

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
    await roleRepo.roleUpdate(id, updates);
  }

  if (typeof payload.permissionIds !== "undefined") {
    const uniquePermissionIds = Array.from(new Set(payload.permissionIds));

    if (uniquePermissionIds.length) {
      const permissions = await roleRepo.permissionsByIds(uniquePermissionIds);
      if (permissions.length !== uniquePermissionIds.length) {
        throw new NotFoundError("One or more permissions were not found");
      }
    }

    await roleRepo.rolePermissionsDeleteMany(id);

    if (uniquePermissionIds.length) {
      await roleRepo.rolePermissionCreateMany(id, uniquePermissionIds);
    }
  }

  const updated = await getRoleById(id);

  await recordAuditLog({
    ...resolveAuditActorFromOptions(options),
    action: "role.updated",
    targetType: "role",
    targetId: updated.id,
    metadata: { before, after: updated },
  });

  return updated;
}

export async function deleteRole(id: string, options?: AuditLogOptions) {
  const role = await roleRepo.roleById(id);
  if (!role) throw new NotFoundError("Role not found");

  const before = mapRoleToPublic({
    ...role,
    permissions: role.permissions.map(({ permission }) => mapPermissionToPublic(permission)),
  });

  await roleRepo.rolePermissionsDeleteMany(id);
  await roleRepo.roleDelete(id);

  await recordAuditLog({
    ...resolveAuditActorFromOptions(options),
    action: "role.deleted",
    targetType: "role",
    targetId: id,
    metadata: { role: before },
  });
}

function mapRolePermissionToPublic(raw: unknown) {
  const entity = rolePermissionEntitySchema.parse(raw);

  return rolePermissionPublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
  });
}

function mapPermissionAssignment(raw: unknown) {
  const entity = rolePermissionEntitySchema
    .extend({
      permission: permissionEntitySchema,
    })
    .parse(raw);

  return rolePermissionAssignmentSchema.parse({
    id: entity.permission.id,
    key: entity.permission.key,
    name: entity.permission.name,
    description: entity.permission.description,
    assignedAt: entity.createdAt.toISOString(),
  });
}

export async function assignPermissionToRole(
  roleId: string,
  raw: unknown,
  options?: AuditLogOptions,
) {
  const payload = assignRolePermissionSchema.parse(raw);

  const role = await roleRepo.roleById(roleId);
  if (!role) throw new NotFoundError("Role not found");

  const permissions = await roleRepo.permissionsByIds([payload.permissionId]);
  if (!permissions.length) throw new NotFoundError("Permission not found");

  const existing = await roleRepo.rolePermissionByIds(roleId, payload.permissionId);
  if (existing) throw new ConflictError("Role already has this permission");

  const created = await roleRepo.rolePermissionCreate(roleId, payload.permissionId);

  const assignment = mapRolePermissionToPublic(created);

  await recordAuditLog({
    ...resolveAuditActorFromOptions(options),
    action: "role.permission.assigned",
    targetType: "role",
    targetId: roleId,
    metadata: { roleId, permissionId: payload.permissionId },
  });

  return assignment;
}

export async function removePermissionFromRole(
  roleId: string,
  permissionId: string,
  options?: AuditLogOptions,
) {
  const role = await roleRepo.roleById(roleId);
  if (!role) throw new NotFoundError("Role not found");

  const assignment = await roleRepo.rolePermissionByIds(roleId, permissionId);
  if (!assignment) throw new NotFoundError("Role does not have this permission");

  await roleRepo.rolePermissionDelete(roleId, permissionId);

  await recordAuditLog({
    ...resolveAuditActorFromOptions(options),
    action: "role.permission.removed",
    targetType: "role",
    targetId: roleId,
    metadata: { roleId, permissionId },
  });
}

export async function listRolePermissions(roleId: string) {
  const role = await roleRepo.roleById(roleId);
  if (!role) throw new NotFoundError("Role not found");

  const rows = await roleRepo.rolePermissionsWithDetails(roleId);
  const items = rows.map(mapPermissionAssignment);

  return listRolePermissionsResponseSchema.parse({ items });
}
