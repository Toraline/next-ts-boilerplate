import { Prisma } from "@prisma/client";
import prisma from "lib/database/prisma";
import { listPermissionsQuerySchema } from "../schema";

export const permissionByKey = (key: string) =>
  prisma.permission.findUnique({
    where: { key },
  });

export const permissionCreate = (data: Prisma.PermissionCreateInput) =>
  prisma.permission.create({
    data,
  });

export const permissionById = (id: string) =>
  prisma.permission.findUnique({
    where: { id },
  });

export const permissionUpdate = (id: string, data: Prisma.PermissionUpdateInput) =>
  prisma.permission.update({
    where: { id },
    data,
  });

export const permissionDelete = (id: string) =>
  prisma.permission.delete({
    where: { id },
  });

export async function permissionFindMany(rawQuery: unknown) {
  const { page, pageSize, search, sortBy, sortDir } = listPermissionsQuerySchema.parse(rawQuery);

  const where: Prisma.PermissionWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { key: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.permission.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.permission.count({ where }),
  ]);

  return { items, total, page, pageSize };
}
