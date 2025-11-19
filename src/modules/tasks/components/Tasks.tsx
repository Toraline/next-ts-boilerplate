"use client";

import { Button } from "global/ui";
import { CATEGORIES_UI } from "../../categories";
import { GLOBAL_UI } from "global/constants";
import { useTasksList } from "../hooks/useTasksList";
import { FormNewTask } from "./FormNewTask/FormNewTask";
import FormEditTask from "./FormEditTask/FormEditTask";
import { useState } from "react";

type TasksProps = {
  categoryId: string;
};

export const Tasks = ({ categoryId }: TasksProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const { data, isLoading, error } = useTasksList({ categoryId });

  const toggleCreateMode = () => {
    setIsCreating(!isCreating);
  };
  return (
    <div className="flex-col flex gap-2">
      <div className=" flex align-middle flex-row justify-between">
        <h2 className="text-2xl font-semibold">{CATEGORIES_UI.HEADERS.TASKS}</h2>
        <Button onClick={toggleCreateMode} size="sm">
          {GLOBAL_UI.BUTTONS.NEW_TASK}
        </Button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {data?.items && (
        <div className="flex-col flex gap-2">
          {data?.items.map((task) => (
            <div className=" flex gap-2">
              <FormEditTask taskId={task.id} initialState={task} />
            </div>
          ))}
          {isCreating ? <FormNewTask categoryId={categoryId} /> : ""}
        </div>
      )}
    </div>
  );
};
