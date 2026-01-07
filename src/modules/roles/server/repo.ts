import { Prisma } from "@prisma/client";
import prisma from "lib/database/prisma";
import { listRolesQuerySchema } from "../schema";

export const roleById = (id: string) =>
  prisma.role.findUnique({
    where: { id },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });

export const roleByKey = (key: string) =>
  prisma.role.findUnique({
    where: { key },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });

export const roleCreate = (data: Prisma.RoleCreateInput) =>
  prisma.role.create({
    data,
  });

export const roleUpdate = (id: string, data: Prisma.RoleUpdateInput) =>
  prisma.role.update({
    where: { id },
    data,
  });

export const rolePermissionCreateMany = async (roleId: string, permissionKeys: string[]) => {
  const permissions = await permissionsByKeys(permissionKeys);
  const permissionIdMap = new Map(permissions.map((permission) => [permission.key, permission.id]));
  const permissionIds = permissionKeys.map((key) => {
    const id = permissionIdMap.get(key);
    if (!id) throw new Error(`Permission with key "${key}" not found`);
    return id;
  });

  return prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    })),
    skipDuplicates: true,
  });
};

export const rolePermissionCreate = async (roleId: string, permissionKey: string) => {
  const permissions = await permissionsByKeys([permissionKey]);
  if (!permissions.length) throw new Error(`Permission with key "${permissionKey}" not found`);
  const [permission] = permissions;
  const permissionId = permission.id;

  const result = await prisma.rolePermission.create({
    data: { roleId, permissionId },
    include: { permission: true },
  });

  return {
    ...result,
    permissionKey: result.permission.key,
  };
};

export const rolePermissionsDeleteMany = (roleId: string) =>
  prisma.rolePermission.deleteMany({
    where: { roleId },
  });

export const rolePermissionDelete = async (roleId: string, permissionKey: string) => {
  const permissions = await permissionsByKeys([permissionKey]);
  if (!permissions.length) throw new Error(`Permission with key "${permissionKey}" not found`);
  const [permission] = permissions;
  const permissionId = permission.id;

  return prisma.rolePermission.delete({
    where: { roleId_permissionId: { roleId, permissionId } },
  });
};

export const permissionsByKeys = (keys: string[]) =>
  prisma.permission.findMany({
    where: { key: { in: keys } },
  });

export const roleDelete = (id: string) =>
  prisma.role.delete({
    where: { id },
  });

export const rolePermissionByIds = async (roleId: string, permissionKey: string) => {
  const permissions = await permissionsByKeys([permissionKey]);
  if (!permissions.length) return null;
  const [permission] = permissions;
  const permissionId = permission.id;

  const result = await prisma.rolePermission.findUnique({
    where: { roleId_permissionId: { roleId, permissionId } },
    include: { permission: true },
  });

  if (!result) return null;

  return {
    ...result,
    permissionKey: result.permission.key,
  };
};

export async function rolePermissionsWithDetails(roleId: string) {
  return prisma.rolePermission.findMany({
    where: { roleId },
    include: {
      permission: true,
    },
  });
}

export async function roleFindMany(rawQuery: unknown) {
  const { page, pageSize, search, sortBy, sortDir } = listRolesQuerySchema.parse(rawQuery);

  const where: Prisma.RoleWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { key: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.role.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    }),
    prisma.role.count({ where }),
  ]);

  return { items, total, page, pageSize };
}
