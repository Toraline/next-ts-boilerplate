import { Field } from "global/ui";
import { Button } from "global/ui";
import { GLOBAL_UI } from "global/constants";
import { useCreateTask } from "modules/tasks/hooks/useCreateTask";
import { CreateTask } from "modules/tasks/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "modules/tasks/schema";
import { useForm } from "react-hook-form";
import { TASK_ERRORS } from "modules/tasks/constants/errors";
import { toast } from "sonner";
import { TASK_SUCCESSES } from "modules/tasks/constants/successes";
import { Save } from "global/ui/icons";

type TasksProps = {
  categoryId: string;
};

export const FormNewTask = ({ categoryId }: TasksProps) => {
  const createTaskMutation = useCreateTask();

  const onSubmit = (data: CreateTask) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        toast.success(TASK_SUCCESSES.CREATE_TASK_SUCCESS);
      },
      onError: () => {
        toast.error(TASK_ERRORS.CREATE_TASK_ERROR);
      },
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTask>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      description: "",
      categoryId,
    },
  });
  const isLoading = createTaskMutation.isPending || isSubmitting;

  return (
    <>
      <div className="flex rounded-xl border-neutral-300 border cursor-pointer relative grow">
        <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-row ">
          <Field
            placeholder="Type your task name here"
            aria-label="input"
            variant="borderless"
            id="task-description"
            type="text"
            {...register("description")}
            error={errors.description?.message}
          />
          <div className="flex p-4">
            <Button aria-label="save" type="submit" disabled={isLoading} variant="transparent">
              {isLoading ? GLOBAL_UI.BUTTONS.SAVING : <Save />}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
