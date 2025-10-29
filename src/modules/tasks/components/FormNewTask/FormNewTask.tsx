import { Field } from "global/ui";
import { Button } from "global/ui";
import { GLOBAL_UI } from "global/constants";
import { useCreateTask } from "modules/tasks/hooks/useCreateTask";
import { useRouter } from "next/navigation";
// import { CreateTask } from "modules/tasks/types";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createTaskSchema } from "modules/tasks/schema";
// import { useForm } from "react-hook-form";

export const FormNewTask = () => {
  const router = useRouter();

  //   const { register, handleSubmit } = useForm<CreateTask>({
  //     resolver: zodResolver(createTaskSchema),
  //     defaultValues: {
  //       description: "",
  //     },
  //   });

  const createTaskMutation = useCreateTask();
  const onSubmit = () => {
    createTaskMutation.mutate(
      { description: "batata" },
      {
        onSuccess: (data) => {
          router.push(`/categories/${data.categoryId}`);
          console.log(onSubmit);
        },
      },
    );
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Field id="task-description" type="text" />
        <Button type="submit" onClick={() => console.log("Criou")}>
          {GLOBAL_UI.BUTTONS.NEW_TASK}
        </Button>
      </form>
    </>
  );
};
