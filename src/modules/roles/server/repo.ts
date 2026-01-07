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

export const rolePermissionCreateMany = (roleId: string, permissionKeys: string[]) =>
  prisma.rolePermission.createMany({
    data: permissionKeys.map((permissionKey) => ({
      roleId,
      permissionKey,
    })),
    skipDuplicates: true,
  });

export const rolePermissionCreate = (roleId: string, permissionKey: string) =>
  prisma.rolePermission.create({
    data: { roleId, permissionKey },
  });

export const rolePermissionsDeleteMany = (roleId: string) =>
  prisma.rolePermission.deleteMany({
    where: { roleId },
  });

export const rolePermissionDelete = (roleId: string, permissionKey: string) =>
  prisma.rolePermission.delete({
    where: { roleId_permissionKey: { roleId, permissionKey } },
  });

export const permissionsByKeys = (keys: string[]) =>
  prisma.permission.findMany({
    where: { key: { in: keys } },
  });

export const roleDelete = (id: string) =>
  prisma.role.delete({
    where: { id },
  });

export const rolePermissionByIds = (roleId: string, permissionKey: string) =>
  prisma.rolePermission.findUnique({
    where: { roleId_permissionKey: { roleId, permissionKey } },
  });

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
