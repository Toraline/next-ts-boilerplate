import { Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "lib/http/errors";
import {
  createRoleSchema,
  listRolesQuerySchema,
  listRolesResponseSchema,
  permissionEntitySchema,
  roleEntitySchema,
  rolePublicSchema,
  updateRoleSchema,
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

export async function createRole(raw: unknown) {
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

  return mapRoleToPublic({
    ...role,
    permissions,
  });
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

export async function updateRole(id: string, raw: unknown) {
  const payload = updateRoleSchema.parse(raw);

  const role = await roleRepo.roleById(id);
  if (!role) throw new NotFoundError("Role not found");

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

  return getRoleById(id);
}

export async function deleteRole(id: string) {
  const role = await roleRepo.roleById(id);
  if (!role) throw new NotFoundError("Role not found");

  await roleRepo.rolePermissionsDeleteMany(id);
  await roleRepo.roleDelete(id);
}
