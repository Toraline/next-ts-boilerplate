import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { CLIENT_ERROR_MESSAGES } from "../constants/errors";
import { VALIDATION_MESSAGES } from "../constants/validation";

export class NotFoundError extends Error {
  constructor(message = CLIENT_ERROR_MESSAGES.NOT_FOUND_DEFAULT) {
    super(message);
    this.name = "NotFoundError";
  }
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    const msg = err.issues.map((i) => i.message).join("; ");
    return msg || VALIDATION_MESSAGES.INVALID_INPUT;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return CLIENT_ERROR_MESSAGES.UNIQUE_CONSTRAINT_FAILED;
    if (err.code === "P2025") return CLIENT_ERROR_MESSAGES.RECORD_NOT_FOUND;
  }

  if (err instanceof Error) return err.message;

  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function getHttpStatus(err: unknown): number {
  if (err instanceof ZodError) return 400;
  if (err instanceof NotFoundError) return 404;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return 409;
  }
  return 400;
}
