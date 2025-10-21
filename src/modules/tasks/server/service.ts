import { createTaskSchema } from "../schema";
import { taskCreate } from "./repo";

export async function createTask(raw: unknown) {
  const task = createTaskSchema.parse(raw);

  const createdTask = await taskCreate({
    description: task.description.trim(),
    checked: task.checked || false,
    categoryId: task.categoryId,
  });
  return createdTask;
}
