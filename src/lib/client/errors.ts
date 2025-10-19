import { CLIENT_ERROR_MESSAGES } from "../constants/errors";

export interface ApiErrorResponse {
  error: string;
}

export class ApiError extends Error {
  public status: number;
  public response?: Response;

  constructor(message: string, status: number, response?: Response) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

/**
 * Generic error handler for client-side API errors
 * Handles common error scenarios (network, server errors, etc.)
 */
export function handleGenericError(error: unknown): never {
  // Network errors and fetch failures
  if (error instanceof TypeError && error.message.includes("fetch")) {
    console.error("Network error:", error);
    throw new ApiError(CLIENT_ERROR_MESSAGES.NETWORK_ERROR, 0);
  }

  // API errors from our backend
  if (error instanceof ApiError) {
    console.error("API error:", error.message, "Status:", error.status);
    throw error; // Re-throw to let caller handle specific logic if needed
  }

  // Generic errors
  if (error instanceof Error) {
    console.error("Unexpected error:", error);
    throw new ApiError(CLIENT_ERROR_MESSAGES.UNEXPECTED_ERROR, 500);
  }

  // Fallback for unknown error types
  console.error("Unknown error type:", error);
  throw new ApiError(CLIENT_ERROR_MESSAGES.UNEXPECTED_ERROR, 500);
}

/**
 * Processes fetch response and throws appropriate errors
 */
export async function processFetchResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = CLIENT_ERROR_MESSAGES.REQUEST_FAILED(response.status);

    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If response is not JSON, use default message
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status, response);
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(CLIENT_ERROR_MESSAGES.INVALID_RESPONSE_FORMAT, response.status, response);
  }
}
