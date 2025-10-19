"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, PropsWithChildren } from "react";
import { ApiError, handleGenericError } from "./errors";

export function ReactQueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            // Global error handler for queries
            if (error instanceof ApiError) {
              console.error("Query error:", error.message, "Status:", error.status);
              // Here you could add toast notifications, etc.
            } else {
              handleGenericError(error);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            // Global error handler for mutations
            if (error instanceof ApiError) {
              console.error("Mutation error:", error.message, "Status:", error.status);
              // Here you could add toast notifications, etc.
            } else {
              handleGenericError(error);
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors (client errors)
              if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                return false;
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
