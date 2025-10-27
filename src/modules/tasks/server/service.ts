import { NotFoundError } from "lib/http/errors";
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

export async function createTask(raw: unknown) {
  const task = createTaskSchema.parse(raw);

  const createdTask = await taskCreate({
    description: task.description.trim(),
    checked: task.checked || false,
    categoryId: task.categoryId,
  });
  return createdTask;
}

export async function getTaskById(raw: unknown) {
  const taskId = idSchema.parse(raw);
  const foundTaskId = await taskById(taskId);

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

export async function listTasks(rawQuery: unknown) {
  const query = listTasksQuerySchema.parse(rawQuery);

  const response = await taskFindMany(query);

  const tasks = response.items.map(toPublic);

  return listTasksResponseSchema.parse({ ...response, items: tasks });
}

export async function updateTaskById(id: string, raw: unknown) {
  const existingTask = await taskById(id);

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

export async function deleteTaskById(id: string) {
  const existingTask = await taskById(id);

  if (!existingTask) throw new NotFoundError();

  await taskDelete(existingTask.id);

  return;
}
