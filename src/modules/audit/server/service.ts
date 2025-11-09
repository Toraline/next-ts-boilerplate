import { NotFoundError } from "lib/http/errors";
import type { AuditActor, AuditActorPayload } from "../schema";
import type { AuditLogOptions } from "../types";
import {
  auditLogEntitySchema,
  auditLogPublicSchema,
  createAuditLogSchema,
  listAuditLogsQuerySchema,
  listAuditLogsResponseSchema,
} from "../schema";
import * as auditRepo from "./repo";

function mapAuditLogToPublic(raw: unknown) {
  const entity = auditLogEntitySchema.parse(raw);

  return auditLogPublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
  });
}

export function resolveAuditActor(actor?: AuditActor): AuditActorPayload {
  if (!actor) return { actorType: "SYSTEM" };

  if (actor.type === "USER") {
    if (!actor.userId) {
      console.warn("[audit] USER actor provided without userId. Falling back to SYSTEM actor.");
      return { actorType: "SYSTEM" };
    }

    return { actorType: "USER", actorUserId: actor.userId };
  }

  return { actorType: actor.type };
}

export function resolveAuditActorFromOptions(options?: AuditLogOptions) {
  return resolveAuditActor(options?.actor);
}

export async function recordAuditLog(raw: unknown) {
  const payload = createAuditLogSchema.parse(raw);

  const created = await auditRepo.auditLogCreate({
    actorType: payload.actorType,
    actor:
      payload.actorType === "USER" && payload.actorUserId
        ? {
            connect: { id: payload.actorUserId },
          }
        : undefined,
    action: payload.action,
    targetType: payload.targetType,
    targetId: payload.targetId,
    metadata: payload.metadata ?? undefined,
    ip: payload.ip ?? null,
    userAgent: payload.userAgent ?? null,
  });

  return mapAuditLogToPublic(created);
}

export async function listAuditLogs(rawQuery: unknown) {
  const query = listAuditLogsQuerySchema.parse(rawQuery);

  const { items, total, page, pageSize } = await auditRepo.auditLogFindMany(query);

  const logs = items.map(mapAuditLogToPublic);

  return listAuditLogsResponseSchema.parse({
    items: logs,
    total,
    page,
    pageSize,
  });
}

export async function getAuditLogById(id: string) {
  const log = await auditRepo.auditLogById(id);
  if (!log) throw new NotFoundError("Audit log not found");

  return mapAuditLogToPublic(log);
}
