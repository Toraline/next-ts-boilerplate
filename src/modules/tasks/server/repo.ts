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
  const { page, pageSize, search, sortBy, sortDir } = listTasksQuerySchema.parse(raw);

  const where: Prisma.TaskWhereInput = search
    ? {
        OR: [{ description: { contains: search, mode: "insensitive" } }],
      }
    : {};

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
