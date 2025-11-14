"use client";

import { Button } from "global/ui";
import { CATEGORIES_UI } from "../../categories";
import { GLOBAL_UI } from "global/constants";
import { useTasksList } from "../hooks/useTasksList";
import { FormNewTask } from "./FormNewTask/FormNewTask";
import FormEditTask from "./FormEditTask/FormEditTask";

type TasksProps = {
  categoryId: string;
};

export const Tasks = ({ categoryId }: TasksProps) => {
  const { data, isLoading, error } = useTasksList({ categoryId });

  return (
    <div>
      <div className=" flex align-middle flex-row justify-between">
        <h2 className="text-2xl font-semibold">{CATEGORIES_UI.HEADERS.TASKS}</h2>
        <Button size="sm">{GLOBAL_UI.BUTTONS.NEW_TASK}</Button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {data?.items && (
        <div>
          {data?.items.map((task) => (
            <div className=" flex gap-2">
              <FormEditTask taskId={task.id} initialState={task} />
            </div>
          ))}
          <FormNewTask categoryId={categoryId} />
        </div>
      )}
    </div>
  );
};
