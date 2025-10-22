import { NotFoundError } from "lib/http/errors";
import { createTaskSchema, idSchema } from "../schema";
import { taskById, taskCreate } from "./repo";

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
