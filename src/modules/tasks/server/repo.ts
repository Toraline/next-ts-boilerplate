import prisma from "lib/database/prisma";
import { CreateTask } from "modules/tasks/types";

export async function taskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function taskCreate(data: CreateTask) {
  return prisma.task.create({ data });
}
