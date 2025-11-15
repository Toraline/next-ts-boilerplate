import prisma from "lib/database/prisma";
import { CreateTask } from "modules/tasks/types";
import { listTasksQuerySchema } from "../schema";
import { Prisma } from "@prisma/client";

export async function taskById(id: string, userId?: string) {
  const where: { id: string; userId?: string } = { id };
  if (userId) where.userId = userId;
  return prisma.task.findUnique({ where });
}

export async function taskCreate(data: CreateTask & { userId: string }) {
  return prisma.task.create({ data });
}

export async function taskFindMany(raw: unknown, userId: string) {
  const { page, pageSize, search, categoryId, sortBy, sortDir } = listTasksQuerySchema.parse(raw);

  const filterConditions: Prisma.TaskWhereInput[] = [];
  if (search) {
    filterConditions.push({ description: { contains: search, mode: "insensitive" } });
  }
  if (categoryId) {
    filterConditions.push({ categoryId });
  }

  const where: Prisma.TaskWhereInput = {
    userId,
    ...(filterConditions.length > 0 ? { AND: filterConditions } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.task.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export const taskUpdate = (id: string, data: Prisma.TaskUpdateInput) =>
  prisma.task.update({ where: { id }, data });

export const taskDelete = (id: string) => prisma.task.delete({ where: { id } });
