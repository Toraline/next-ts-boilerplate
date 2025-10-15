import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function getErrorMessage(err: unknown): string {
  if (err instanceof ZodError) {
    const msg = err.issues.map((i) => i.message).join("; ");
    return msg || "Invalid input";
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return "Unique constraint failed";
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
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return 409;
  }
  return 400;
}
