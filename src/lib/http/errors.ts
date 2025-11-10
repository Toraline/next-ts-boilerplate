import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { CLIENT_ERROR_MESSAGES } from "../constants/errors";
import { VALIDATION_MESSAGES } from "../constants/validation";

export class NotFoundError extends Error {
  constructor(message: string = CLIENT_ERROR_MESSAGES.NOT_FOUND_DEFAULT) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string = CLIENT_ERROR_MESSAGES.UNIQUE_CONSTRAINT_FAILED) {
    super(message);
    this.name = "ConflictError";
  }
}

export class BadRequestError extends Error {
  constructor(message: string = "Bad request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class TooManyRequestsError extends Error {
  constructor(message: string = "Too many requests") {
    super(message);
    this.name = "TooManyRequestsError";
  }
}
export function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    if (!err.issues.length) return VALIDATION_MESSAGES.INVALID_INPUT;

    return err.issues
      .map((issue) => {
        const path = issue.path.join(".");
        if (!path) return issue.message;
        return `${path}: ${issue.message}`;
      })
      .join("; ");
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
  if (err instanceof BadRequestError) return 400;
  if (err instanceof NotFoundError) return 404;
  if (err instanceof ConflictError) return 409;
  if (err instanceof UnauthorizedError) return 401;
  if (err instanceof ForbiddenError) return 403;
  if (err instanceof TooManyRequestsError) return 429;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return 409;
  }
  return 400;
}
