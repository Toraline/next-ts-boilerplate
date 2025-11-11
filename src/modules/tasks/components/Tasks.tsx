import { Button } from "global/ui";
import { CATEGORIES_UI } from "../../categories";
import { GLOBAL_UI } from "global/constants";
import { useTasksList } from "../hooks/useTasksList";
import "./Tasks.style.css";
import { FormNewTask } from "./FormNewTask/FormNewTask";
import FormEditTask from "./FormEditTask/FormEditTask";
import { DeleteTask } from "global/ui/icons/DeleteTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { TASKS_UI } from "../constants/ui";
import { TASK_ERRORS } from "../constants/errors";
import { toast } from "sonner";
import { TASK_SUCCESSES } from "../constants/successes";

type TasksProps = {
  categoryId: string;
};

export const Tasks = ({ categoryId }: TasksProps) => {
  const { data, isLoading, error } = useTasksList({ categoryId });

  const deleteTaskMutation = useDeleteTask();

  const onDelete = async () => {
    const taskId = data?.items.find((task) => task.id)?.id;
    if (!taskId || !confirm(TASKS_UI.CONFIRMATIONS.DELETE_TASK)) return;

    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        toast.success(TASK_SUCCESSES.DELETE_TASK_SUCCESS);
      },
      onError: () => {
        toast.error(TASK_ERRORS.DELETE_TASK_ERROR);
      },
    });
  };

  return (
    <>
      <div className="task-wrapper">
        <h2 className="subtitle">{CATEGORIES_UI.HEADERS.TASKS}</h2>
        <Button size="sm">{GLOBAL_UI.BUTTONS.NEW_TASK}</Button>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {data?.items && (
        <div>
          {data?.items.map((task) => (
            <div className="task-wrapper">
              <h2 className="subtitle">{task.description}</h2>
              <FormEditTask taskId={task.id} initialState={task} />
              <Button variant="transparent" onClick={onDelete}>
                <DeleteTask />
              </Button>
            </div>
          ))}
          <FormNewTask categoryId={categoryId} />
        </div>
      )}
    </>
  );
};
