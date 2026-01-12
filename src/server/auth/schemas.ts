import { z } from "zod";
import { userIdSchema, emailSchema, userPublicSchema } from "modules/users/schema";
import { isoDateTimeStringSchema } from "lib/validation/datetime";

export const sessionIdSchema = z.string().cuid();

export const loginRequestSchema = z.object({
  email: emailSchema,
});

export const loginResponseSchema = z.object({
  user: userPublicSchema,
  sessionId: sessionIdSchema,
});

export const meResponseSchema = z.object({
  user: userPublicSchema.nullable(),
});

export const sessionDtoSchema = z.object({
  id: sessionIdSchema,
  userId: userIdSchema,
  expiresAt: isoDateTimeStringSchema,
  revokedAt: isoDateTimeStringSchema.nullable(),
});
