import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field } from "global/ui";
import { TASKS_UI } from "modules/tasks/constants/ui";
import { useUpdateTask } from "modules/tasks/hooks/useUpdateTask";
import { createTaskSchema } from "modules/tasks/schema";
import { CreateTask, Task } from "modules/tasks/types";
import { useForm } from "react-hook-form";
import { TASK_ERRORS } from "modules/tasks/constants/errors";
import { GLOBAL_UI } from "global/constants";
import { useState } from "react";
import React from "react";
import { toast } from "sonner";
import { TASK_SUCCESSES } from "modules/tasks/constants/successes";

export default function FormEditTask({
  initialState,
  taskId,
  onSuccess,
}: {
  initialState: Task;
  taskId: string;
  checked?: boolean;
  onSuccess?: () => void;
}) {
  const updateTaskMutation = useUpdateTask();

  const [noChangesMessage, setNoChangesMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTask>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      description: initialState.description,
      checked: initialState.checked,
      categoryId: initialState.categoryId,
    },
  });

  const onSubmit = (data: CreateTask) => {
    setNoChangesMessage(null);
    const updates: Record<string, unknown> = {};
    if (data.description !== initialState.description) {
      updates.description = data.description;
    }
    if (data.checked !== initialState.checked) {
      updates.checked = data.checked;
    }

    if (Object.keys(updates).length === 0) {
      setNoChangesMessage(TASKS_UI.FORM_MESSAGES.NO_CHANGES_DETECTED);
      return;
    }

    updateTaskMutation.mutate(
      {
        taskById: taskId,
        updates,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          toast.success(TASK_SUCCESSES.EDIT_TASK_SUCCESS, { duration: 5000 });
          if (data.checked !== initialState.checked) {
            if (data.checked == true) {
              toast.success(TASK_SUCCESSES.CHECKED_TRUE_TASK, { duration: 3000 });
            } else {
              toast.success(TASK_SUCCESSES.CHECKED_FALSE_TASK, { duration: 3000 });
            }
          }
        },
        onError: (error) => {
          toast.error(TASK_ERRORS.UPDATE_TASK_ERROR, error);
        },
      },
    );
  };

  const isLoading = updateTaskMutation.isPending || isSubmitting;

  return (
    <div className="form-container">
      {updateTaskMutation.error && <div className="error">{updateTaskMutation.error.message}</div>}
      {noChangesMessage && <div className="error">{noChangesMessage}</div>}
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Field
            label={TASKS_UI.LABELS.DESCRIPTION}
            {...register("description")}
            id="task-description"
            type="text"
            error={errors.description?.message}
          />
          <input type="checkbox" {...register("checked")} />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? GLOBAL_UI.BUTTONS.SAVING : GLOBAL_UI.BUTTONS.SAVE_CHANGES}
          </Button>
        </div>
      </form>
    </div>
  );
}
