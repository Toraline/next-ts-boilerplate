import { Prisma } from "@prisma/client";
import { z } from "zod";
import prisma from "lib/database/prisma";
import { listUsersQuerySchema } from "../schema";

export const userById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
  });

export const userByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email },
  });

export const userByClerkUserId = (clerkUserId: string) =>
  prisma.user.findUnique({
    where: { clerkUserId },
  });

export const userCreate = (data: Prisma.UserCreateInput) => prisma.user.create({ data });

export const userUpdate = (id: string, data: Prisma.UserUpdateInput) =>
  prisma.user.update({
    where: { id },
    data,
  });

export const userDelete = (id: string) =>
  prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export async function userFindMany(query: ListUsersQuery) {
  const {
    page,
    pageSize,
    status,
    tenantId,
    email,
    clerkUserId,
    includeDeleted,
    search,
    sortBy,
    sortDir,
  } = query;

  const where: Prisma.UserWhereInput = {
    status: status ?? undefined,
    tenantId: tenantId ?? undefined,
    email: email ?? undefined,
    clerkUserId: clerkUserId ?? undefined,
    deletedAt: includeDeleted ? undefined : null,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { tenantId: { contains: search, mode: "insensitive" } },
      { clerkUserId: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export const roleById = (id: string) => prisma.role.findUnique({ where: { id } });

export const userRoleByIds = (userId: string, roleId: string) =>
  prisma.userRole.findUnique({
    where: { userId_roleId: { userId, roleId } },
  });

export const userRoleCreate = (userId: string, roleId: string) =>
  prisma.userRole.create({
    data: { userId, roleId },
  });

export const userRoleDelete = (userId: string, roleId: string) =>
  prisma.userRole.delete({
    where: { userId_roleId: { userId, roleId } },
  });

export async function userRolesWithPermissions(userId: string) {
  return prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });
}

export const permissionById = (id: string) => prisma.permission.findUnique({ where: { id } });

export const userPermissionByIds = (userId: string, permissionId: string) =>
  prisma.userPermission.findUnique({
    where: { userId_permissionId: { userId, permissionId } },
  });

export const userPermissionCreate = (userId: string, permissionId: string) =>
  prisma.userPermission.create({
    data: { userId, permissionId },
  });

export const userPermissionDelete = (userId: string, permissionId: string) =>
  prisma.userPermission.delete({
    where: { userId_permissionId: { userId, permissionId } },
  });

export async function userPermissionsWithDetails(userId: string) {
  return prisma.userPermission.findMany({
    where: { userId },
    include: {
      permission: true,
    },
  });
}
