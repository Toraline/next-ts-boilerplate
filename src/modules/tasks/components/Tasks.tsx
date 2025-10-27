import { Button } from "global/ui";
import { CATEGORIES_UI } from "../../categories";
import { GLOBAL_UI } from "global/constants";
import { useTasksList } from "../hooks/useTasksList";
import "./Tasks.style.css";

type TasksProps = {
  categoryId: string;
};

export const Tasks = ({ categoryId }: TasksProps) => {
  const { data, isLoading, error } = useTasksList({ categoryId });

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
          {data?.items?.map((task) => (
            <div className="task-wrapper">
              <h2 className="subtitle">{task.description}</h2>
              <Button size="sm">{GLOBAL_UI.BUTTONS.NEW_TASK}</Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
