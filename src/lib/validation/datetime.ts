import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";

export const isoDateTimeStringSchema = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: VALIDATION_MESSAGES.INVALID_INPUT,
  });
