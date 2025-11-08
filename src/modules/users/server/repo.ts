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
