import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "global/ui";
import { TASKS_UI } from "modules/tasks/constants/ui";
import { useUpdateTask } from "modules/tasks/hooks/useUpdateTask";
import { createTaskSchema } from "modules/tasks/schema";
import { CreateTask, Task } from "modules/tasks/types";
import { useForm } from "react-hook-form";
import { TASK_ERRORS } from "modules/tasks/constants/errors";
import { useState } from "react";
import React from "react";
import { useDeleteTask } from "modules/tasks/hooks/useDeleteTask";
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
    formState: { isSubmitting },
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
          toast.success(TASK_SUCCESSES.EDIT_TASK_SUCCESS, { duration: 3000 });
        },
        onError: () => {
          toast.error(TASK_ERRORS.UPDATE_TASK_ERROR);
        },
      },
    );
  };

  const onChecked = (data: CreateTask) => {
    const updates: Record<string, unknown> = {};
    if (data.checked !== initialState.checked) {
      updates.checked = data.checked;
    }

    updateTaskMutation.mutate(
      {
        taskById: taskId,
        updates,
      },
      {
        onSuccess: () => {
          if (data.checked !== initialState.checked) {
            if (data.checked) {
              toast.success(TASK_SUCCESSES.CHECKED_TRUE_TASK, { duration: 2000 });
            } else {
              toast.success(TASK_SUCCESSES.CHECKED_FALSE_TASK, { duration: 2000 });
            }
          }
        },
      },
      {
        onError: (error) => {
          console.error(TASK_ERRORS.UPDATE_TASK_ERROR, error);
        },
      },
    );
  };

  const handleCheckbox = (checked: boolean) => {
    handleSubmit((data) => {
      const newData = { ...data, checked };
      return onChecked(newData);
    })();
  };

  const handleSaveEdit = (description: string) => {
    handleSubmit((data) => onSubmit({ ...data, description }))();
  };
  const deleteTaskMutation = useDeleteTask();

  const onDelete = async () => {
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
  const isLoading = updateTaskMutation.isPending || isSubmitting;

  return (
    <div className=" flex flex-col gap-4 grow">
      {updateTaskMutation.error && <div className="error">{updateTaskMutation.error.message}</div>}
      {noChangesMessage && <div className="error">{noChangesMessage}</div>}
      <form className="form">
        <Item
          isLoading={isLoading}
          content={initialState.description}
          onSaveEdit={handleSaveEdit}
          onDelete={onDelete}
          onComplete={handleCheckbox}
          initialChecked={initialState.checked}
          {...register("description")}
          checkboxId={initialState.id}
        />
      </form>
    </div>
  );
}
