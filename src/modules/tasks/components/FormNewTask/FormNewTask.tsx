import { Field } from "global/ui";
import { Button } from "global/ui";
import { GLOBAL_UI } from "global/constants";
import { useCreateTask } from "modules/tasks/hooks/useCreateTask";
import { useRouter } from "next/navigation";
import { CreateTask } from "modules/tasks/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "modules/tasks/schema";
import { useForm } from "react-hook-form";

type TasksProps = {
  categoryId: string;
};

export const FormNewTask = ({ categoryId }: TasksProps) => {
  const router = useRouter();

  const createTaskMutation = useCreateTask();
  const onSubmit = (data: CreateTask) => {
    createTaskMutation.mutate(data, {
      onSuccess: (createdTask) => {
        router.push(`/categories/${createdTask.categoryId}`);
      },
    });
  };
  const { register, handleSubmit } = useForm<CreateTask>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      description: "",
      categoryId: `${categoryId}`,
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field id="task-description" type="text" {...register("description")} />
        <Button type="submit">{GLOBAL_UI.BUTTONS.NEW_TASK}</Button>
      </form>
    </>
  );
};
