import prisma from "lib/database/prisma";
import { CreateTask } from "modules/tasks/types";
import { listTasksQuerySchema } from "../schema";
import { Prisma } from "@prisma/client";

export async function taskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function taskCreate(data: CreateTask) {
  return prisma.task.create({ data });
}

export async function taskFindMany(raw: unknown) {
  const { page, pageSize, search, categoryId, sortBy, sortDir } = listTasksQuerySchema.parse(raw);

  const options: Prisma.TaskWhereInput[] = [];
  if (search) {
    options.push({ description: { contains: search, mode: "insensitive" } });
  }
  if (categoryId) {
    options.push({ categoryId: { contains: categoryId } });
  }
  const where: Prisma.TaskWhereInput = options.length > 0 ? { OR: options } : {};

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
