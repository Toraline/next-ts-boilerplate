import { processFetchResponse, ApiError, handleGenericError } from "../client/errors";

// Use global fetch types that should be available in browser environment
export async function api<T>(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): Promise<T> {
  try {
    const response = await fetch(input, {
      ...init,
      credentials: init?.credentials ?? "include",
    });
    return await processFetchResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiErrors as-is
    }
    handleGenericError(error);
  }
}
