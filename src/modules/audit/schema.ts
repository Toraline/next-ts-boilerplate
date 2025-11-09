import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";

export const auditLogIdSchema = z.cuid();
export const auditActionSchema = z.string().trim().min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT);
export const auditTargetTypeSchema = z.string().trim().min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT);
export const auditTargetIdSchema = z.string().trim().min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT);
export const auditActorTypeSchema = z.enum(["USER", "SYSTEM", "SERVICE", "WEBHOOK", "ANONYMOUS"]);
export const auditActorUserIdSchema = z.cuid().optional();

export type AuditActorType = z.infer<typeof auditActorTypeSchema>;
type NonUserActorType = Exclude<AuditActorType, "USER">;
export type AuditActor = { type: "USER"; userId: string } | { type: NonUserActorType };
export type AuditActorPayload = {
  actorType: AuditActorType;
  actorUserId?: string;
};

const isoDateTimeString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: VALIDATION_MESSAGES.INVALID_INPUT,
});

export const createAuditLogSchema = z
  .object({
    actorType: auditActorTypeSchema,
    actorUserId: auditActorUserIdSchema,
    action: auditActionSchema,
    targetType: auditTargetTypeSchema,
    targetId: auditTargetIdSchema,
    metadata: z.unknown().optional(),
    ip: z.string().trim().optional(),
    userAgent: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.actorType === "USER" && !value.actorUserId) {
      ctx.addIssue({
        code: "custom",
        path: ["actorUserId"],
        message: "actorUserId is required when actorType is USER",
      });
    }
    if (value.actorType !== "USER" && value.actorUserId) {
      ctx.addIssue({
        code: "custom",
        path: ["actorUserId"],
        message: "actorUserId must be empty when actorType is not USER",
      });
    }
  });

export const auditLogEntitySchema = z.object({
  id: auditLogIdSchema,
  actorUserId: auditActorUserIdSchema.nullable(),
  actorType: auditActorTypeSchema,
  action: auditActionSchema,
  targetType: auditTargetTypeSchema,
  targetId: auditTargetIdSchema,
  metadata: z.unknown().nullable(),
  ip: z.string().trim().nullable(),
  userAgent: z.string().trim().nullable(),
  createdAt: z.date(),
});

export const auditLogPublicSchema = z.object({
  id: auditLogIdSchema,
  actorUserId: auditActorUserIdSchema.nullable(),
  actorType: auditActorTypeSchema,
  action: auditActionSchema,
  targetType: auditTargetTypeSchema,
  targetId: auditTargetIdSchema,
  metadata: z.unknown().nullable(),
  ip: z.string().trim().nullable(),
  userAgent: z.string().trim().nullable(),
  createdAt: isoDateTimeString,
});

export const listAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  actorUserId: z.cuid().optional(),
  actorType: auditActorTypeSchema.optional(),
  targetType: z.string().trim().optional(),
  targetId: z.string().trim().optional(),
  from: isoDateTimeString.optional(),
  to: isoDateTimeString.optional(),
});

export const listAuditLogsResponseSchema = z.object({
  items: z.array(auditLogPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});
