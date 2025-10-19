import { useMutation as useReactQueryMutation } from "@tanstack/react-query";
import { ApiError } from "lib/client-errors";

export interface UseMutationOptions<TData, TError = unknown, TVariables = unknown> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void | Promise<void>;
  onError?: (error: TError, variables: TVariables, context: unknown) => void | Promise<void>;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: unknown,
  ) => void | Promise<void>;
  retry?: number | boolean;
}

/**
 * Generic hook for mutations with React Query
 * Provides consistent patterns for create, update, delete operations across the app
 */
export function useMutation<TData = unknown, TError = ApiError, TVariables = unknown>(
  options: UseMutationOptions<TData, TError, TVariables>,
) {
  const {
    mutationFn,
    onSuccess,
    onError,
    onSettled,
    retry = false, // Don't retry mutations by default
  } = options;

  return useReactQueryMutation({
    mutationFn,
    onSuccess,
    onError,
    onSettled,
    retry,
  });
}
