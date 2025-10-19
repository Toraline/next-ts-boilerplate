import { useQuery } from "@tanstack/react-query";

export interface UseListQueryOptions<TData> {
  queryFn: () => Promise<TData>;
  queryKey: readonly unknown[];
  enabled?: boolean;
  staleTime?: number;
  retry?: number | boolean;
  refetchOnWindowFocus?: boolean;
}

/**
 * Generic hook for fetching list data with React Query
 * Provides consistent patterns for list queries across the app
 */
export function useListQuery<TData = unknown>(options: UseListQueryOptions<TData>) {
  const {
    queryFn,
    queryKey,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    retry = true,
    refetchOnWindowFocus = false,
  } = options;

  return useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    retry,
    refetchOnWindowFocus,
  });
}
