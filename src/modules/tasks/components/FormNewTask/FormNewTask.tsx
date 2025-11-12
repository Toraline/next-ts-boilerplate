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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          id="task-description"
          type="text"
          {...register("description")}
          error={errors.description?.message}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.NEW_TASK}
        </Button>
      </form>
    </>
  );
};
