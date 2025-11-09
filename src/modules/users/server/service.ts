import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ConflictError, NotFoundError } from "lib/http/errors";
import { recordAuditLog, resolveAuditActor } from "modules/audit";
import type { AuditActor } from "modules/audit";
import {
  assignUserRoleSchema,
  assignUserPermissionSchema,
  createUserSchema,
  listUsersQuerySchema,
  listUsersResponseSchema,
  listUserRolesResponseSchema,
  listUserPermissionsResponseSchema,
  permissionDescriptionSchema,
  permissionIdSchema,
  permissionKeySchema,
  permissionNameSchema,
  permissionWithAssignmentSchema,
  roleWithPermissionsSchema,
  updateUserSchema,
  userEntitySchema,
  userPublicSchema,
  userRoleEntitySchema,
  userRolePublicSchema,
  userPermissionEntitySchema,
  userPermissionPublicSchema,
} from "../schema";
import * as userRepo from "./repo";

function mapToPublic(raw: unknown) {
  const entity = userEntitySchema.parse(raw);

  return userPublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    lastLoginAt: entity.lastLoginAt ? entity.lastLoginAt.toISOString() : null,
    deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
  });
}

function mapUserRoleToPublic(raw: unknown) {
  const entity = userRoleEntitySchema.parse(raw);

  return userRolePublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
  });
}

function mapUserPermissionToPublic(raw: unknown) {
  const entity = userPermissionEntitySchema.parse(raw);

  return userPermissionPublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
  });
}

function mapRoleWithPermissions(raw: unknown) {
  const row = userRoleEntitySchema
    .extend({
      role: z.object({
        id: roleWithPermissionsSchema.shape.id,
        key: roleWithPermissionsSchema.shape.key,
        name: roleWithPermissionsSchema.shape.name,
        description: roleWithPermissionsSchema.shape.description,
        permissions: z.array(
          z.object({
            permission: z.object({
              id: permissionIdSchema,
              key: permissionKeySchema,
              name: permissionNameSchema,
              description: permissionDescriptionSchema,
            }),
          }),
        ),
      }),
    })
    .parse(raw);

  const permissions = row.role.permissions.map(({ permission }) => ({
    id: permission.id,
    key: permission.key,
    name: permission.name,
    description: permission.description,
  }));

  return roleWithPermissionsSchema.parse({
    id: row.role.id,
    key: row.role.key,
    name: row.role.name,
    description: row.role.description,
    permissions,
    assignedAt: row.createdAt.toISOString(),
  });
}

function mapPermissionWithAssignment(raw: unknown) {
  const entity = userPermissionEntitySchema
    .extend({
      permission: z.object({
        id: permissionIdSchema,
        key: permissionKeySchema,
        name: permissionNameSchema,
        description: permissionDescriptionSchema,
      }),
    })
    .parse(raw);

  return permissionWithAssignmentSchema.parse({
    id: entity.permission.id,
    key: entity.permission.key,
    name: entity.permission.name,
    description: entity.permission.description,
    assignedAt: entity.createdAt.toISOString(),
  });
}

type ServiceOptions = {
  actor?: AuditActor;
};

function auditActor(options?: ServiceOptions) {
  return resolveAuditActor(options?.actor);
}

export async function createUser(raw: unknown, options?: ServiceOptions) {
  const data = createUserSchema.parse(raw);

  if (await userRepo.userByEmail(data.email)) {
    throw new ConflictError("User with this email already exists");
  }

  if (data.clerkUserId) {
    const existingClerk = await userRepo.userByClerkUserId(data.clerkUserId);
    if (existingClerk) {
      throw new ConflictError("User with this clerkUserId already exists");
    }
  }

  const created = await userRepo.userCreate({
    email: data.email,
    name: data.name,
    avatarUrl: data.avatarUrl ?? null,
    status: data.status,
    tenantId: data.tenantId ?? null,
    clerkUserId: data.clerkUserId ?? null,
  });

  const user = mapToPublic(created);

  await recordAuditLog({
    ...auditActor(options),
    action: "user.created",
    targetType: "user",
    targetId: user.id,
    metadata: { user },
  });

  return user;
}

export async function listUsers(rawQuery: unknown) {
  const query = listUsersQuerySchema.parse(rawQuery);

  const { items, total, page, pageSize } = await userRepo.userFindMany(query);

  const publicItems = items.map(mapToPublic);

  return listUsersResponseSchema.parse({
    items: publicItems,
    total,
    page,
    pageSize,
  });
}

type ResolveUserInput = { id?: string; email?: string; clerkUserId?: string };

async function resolveUser(input: ResolveUserInput, options?: { includeDeleted?: boolean }) {
  const includeDeleted = options?.includeDeleted ?? false;

  if (input.email) {
    const byEmail = await userRepo.userByEmail(input.email);
    if (byEmail) {
      if (!includeDeleted && byEmail.deletedAt) throw new NotFoundError("User not found");
      return byEmail;
    }
  }

  if (input.clerkUserId) {
    const byClerk = await userRepo.userByClerkUserId(input.clerkUserId);
    if (byClerk) {
      if (!includeDeleted && byClerk.deletedAt) throw new NotFoundError("User not found");
      return byClerk;
    }
  }

  if (input.id) {
    const byId = await userRepo.userById(input.id);
    if (byId) {
      if (!includeDeleted && byId.deletedAt) throw new NotFoundError("User not found");
      return byId;
    }
  }

  throw new NotFoundError("User not found");
}

export async function getUser(raw: { id?: unknown; email?: unknown; clerkUserId?: unknown }) {
  const payload = {
    id: typeof raw.id === "string" ? raw.id : undefined,
    email: typeof raw.email === "string" ? raw.email : undefined,
    clerkUserId: typeof raw.clerkUserId === "string" ? raw.clerkUserId : undefined,
  };

  const user = await resolveUser(payload);

  return mapToPublic(user);
}

export async function updateUser(id: string, raw: unknown, options?: ServiceOptions) {
  const patch = updateUserSchema.parse(raw);

  const existing = await resolveUser({ id });

  const before = mapToPublic(existing);

  if (patch.email && patch.email !== existing.email) {
    const emailUsed = await userRepo.userByEmail(patch.email);
    if (emailUsed && emailUsed.id !== existing.id) {
      throw new ConflictError("User with this email already exists");
    }
  }

  if (patch.clerkUserId && patch.clerkUserId !== existing.clerkUserId) {
    const clerkUsed = await userRepo.userByClerkUserId(patch.clerkUserId);
    if (clerkUsed && clerkUsed.id !== existing.id) {
      throw new ConflictError("User with this clerkUserId already exists");
    }
  }

  const data: Prisma.UserUpdateInput = {};

  if (typeof patch.name !== "undefined") data.name = patch.name;
  if (typeof patch.avatarUrl !== "undefined") data.avatarUrl = patch.avatarUrl ?? null;
  if (typeof patch.email !== "undefined") data.email = patch.email;
  if (typeof patch.status !== "undefined") data.status = patch.status;
  if (typeof patch.tenantId !== "undefined") data.tenantId = patch.tenantId ?? null;
  if (typeof patch.clerkUserId !== "undefined") data.clerkUserId = patch.clerkUserId ?? null;
  if (typeof patch.lastLoginAt !== "undefined") data.lastLoginAt = patch.lastLoginAt ?? null;
  if (typeof patch.deletedAt !== "undefined") data.deletedAt = patch.deletedAt ?? null;

  const updated = await userRepo.userUpdate(existing.id, data);

  const user = mapToPublic(updated);

  await recordAuditLog({
    ...auditActor(options),
    action: "user.updated",
    targetType: "user",
    targetId: user.id,
    metadata: { before, after: user },
  });

  return user;
}

export async function deleteUser(id: string, options?: ServiceOptions) {
  const existing = await resolveUser({ id }, { includeDeleted: true });

  if (existing.deletedAt) {
    throw new NotFoundError("User not found");
  }

  const before = mapToPublic(existing);

  await userRepo.userDelete(existing.id);

  await recordAuditLog({
    ...auditActor(options),
    action: "user.deleted",
    targetType: "user",
    targetId: id,
    metadata: { user: before },
  });
}

export async function assignRoleToUser(userId: string, raw: unknown, options?: ServiceOptions) {
  const payload = assignUserRoleSchema.parse(raw);

  const user = await resolveUser({ id: userId });

  const role = await userRepo.roleById(payload.roleId);
  if (!role) throw new NotFoundError("Role not found");

  const existing = await userRepo.userRoleByIds(user.id, role.id);
  if (existing) throw new ConflictError("User already has this role");

  const created = await userRepo.userRoleCreate(user.id, role.id);

  const assignment = mapUserRoleToPublic(created);

  await recordAuditLog({
    ...auditActor(options),
    action: "user.role.assigned",
    targetType: "user",
    targetId: user.id,
    metadata: { userId: user.id, roleId: role.id },
  });

  return assignment;
}

export async function removeRoleFromUser(userId: string, roleId: string, options?: ServiceOptions) {
  const user = await resolveUser({ id: userId });

  const role = await userRepo.roleById(roleId);
  if (!role) throw new NotFoundError("Role not found");

  const existing = await userRepo.userRoleByIds(user.id, role.id);
  if (!existing) throw new NotFoundError("User does not have this role");

  await userRepo.userRoleDelete(user.id, role.id);

  await recordAuditLog({
    ...auditActor(options),
    action: "user.role.removed",
    targetType: "user",
    targetId: user.id,
    metadata: { userId: user.id, roleId },
  });
}

export async function listUserRoles(userId: string) {
  const user = await resolveUser({ id: userId });

  const rows = await userRepo.userRolesWithPermissions(user.id);

  const items = rows.map(mapRoleWithPermissions);

  return listUserRolesResponseSchema.parse({ items });
}

export async function assignPermissionToUser(
  userId: string,
  raw: unknown,
  options?: ServiceOptions,
) {
  const payload = assignUserPermissionSchema.parse(raw);

  const user = await resolveUser({ id: userId });

  const permission = await userRepo.permissionById(payload.permissionId);
  if (!permission) throw new NotFoundError("Permission not found");

  const existing = await userRepo.userPermissionByIds(user.id, permission.id);
  if (existing) throw new ConflictError("User already has this permission");

  const created = await userRepo.userPermissionCreate(user.id, permission.id);

  const assignment = mapUserPermissionToPublic(created);

  await recordAuditLog({
    ...auditActor(options),
    action: "user.permission.assigned",
    targetType: "user",
    targetId: user.id,
    metadata: { userId: user.id, permissionId: permission.id },
  });

  return assignment;
}

export async function removePermissionFromUser(
  userId: string,
  permissionId: string,
  options?: ServiceOptions,
) {
  const user = await resolveUser({ id: userId });

  const permission = await userRepo.permissionById(permissionId);
  if (!permission) throw new NotFoundError("Permission not found");

  const existing = await userRepo.userPermissionByIds(user.id, permission.id);
  if (!existing) throw new NotFoundError("User does not have this permission");

  await userRepo.userPermissionDelete(user.id, permission.id);

  await recordAuditLog({
    ...auditActor(options),
    action: "user.permission.removed",
    targetType: "user",
    targetId: user.id,
    metadata: { userId: user.id, permissionId },
  });
}

export async function listUserPermissions(userId: string) {
  const user = await resolveUser({ id: userId });

  const rows = await userRepo.userPermissionsWithDetails(user.id);

  const items = rows.map(mapPermissionWithAssignment);

  return listUserPermissionsResponseSchema.parse({ items });
}
