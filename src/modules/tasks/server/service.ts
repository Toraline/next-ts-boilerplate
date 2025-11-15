import { NotFoundError, UnauthorizedError } from "lib/http/errors";
import {
  createTaskSchema,
  idSchema,
  listTasksQuerySchema,
  listTasksResponseSchema,
  taskEntitySchema,
  taskPublicSchema,
  updateTaskSchema,
} from "../schema";
import { taskById, taskCreate, taskDelete, taskFindMany, taskUpdate } from "./repo";

export async function createTask(raw: unknown, userId: string) {
  if (!userId) {
    throw new UnauthorizedError("User ID is required");
  }

  const task = createTaskSchema.parse(raw);

  const createdTask = await taskCreate({
    description: task.description,
    checked: task.checked || false,
    categoryId: task.categoryId,
    userId,
  });
  return createdTask;
}

export async function getTaskById(raw: unknown, userId: string) {
  if (!userId) {
    throw new UnauthorizedError("User ID is required");
  }

  const taskId = idSchema.parse(raw);
  const foundTaskId = await taskById(taskId, userId);

  if (!foundTaskId) {
    throw new NotFoundError();
  }

  return foundTaskId;
}

function toPublic(row: unknown) {
  const entity = taskEntitySchema.parse(row);

  return taskPublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  });
}

export async function listTasks(rawQuery: unknown, userId: string) {
  if (!userId) {
    throw new UnauthorizedError("User ID is required");
  }

  const query = listTasksQuerySchema.parse(rawQuery);

  const response = await taskFindMany(query, userId);

  const tasks = response.items.map(toPublic);

  return listTasksResponseSchema.parse({ ...response, items: tasks });
}

export async function updateTaskById(id: string, raw: unknown, userId: string) {
  if (!userId) {
    throw new UnauthorizedError("User ID is required");
  }

  const existingTask = await taskById(id, userId);

  if (!existingTask) throw new NotFoundError();

  const patch = updateTaskSchema.parse(raw);

  const prismaPatch: Record<string, unknown> = {};

  if (typeof patch.description !== "undefined") {
    prismaPatch.description = patch.description.trim();
  }

  prismaPatch.checked = patch.checked;

  const updatedTask = await taskUpdate(existingTask.id, prismaPatch);

  return toPublic(updatedTask);
}

export async function deleteTaskById(id: string, userId: string) {
  if (!userId) {
    throw new UnauthorizedError("User ID is required");
  }

  const existingTask = await taskById(id, userId);

  if (!existingTask) throw new NotFoundError();

  await taskDelete(existingTask.id);

  return;
}
