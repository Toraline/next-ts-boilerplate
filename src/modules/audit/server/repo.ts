import { Prisma } from "@prisma/client";
import prisma from "lib/database/prisma";
import { listAuditLogsQuerySchema } from "../schema";

export const auditLogCreate = (data: Prisma.AuditLogCreateInput) =>
  prisma.auditLog.create({
    data,
  });

export const auditLogById = (id: string) =>
  prisma.auditLog.findUnique({
    where: { id },
  });

export async function auditLogFindMany(rawQuery: unknown) {
  const query = listAuditLogsQuerySchema.parse(rawQuery);
  const { page, pageSize, actorUserId, actorType, targetType, targetId, from, to } = query;

  const where: Prisma.AuditLogWhereInput = {
    actorUserId: actorUserId ?? undefined,
    actorType: actorType ?? undefined,
    targetType: targetType ?? undefined,
    targetId: targetId ?? undefined,
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
  };

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { items, total, page, pageSize };
}
