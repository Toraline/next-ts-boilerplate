import { Prisma } from "@prisma/client";
import prisma from "lib/database/prisma";

const ACTIVE_SESSION_FILTER = (asOf: Date) => ({
  revokedAt: null,
  expiresAt: { gt: asOf },
});

export type SessionWithUser = Prisma.SessionGetPayload<{ include: { user: true } }>;

export const createSession = (input: {
  userId: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipHash?: string | null;
}) =>
  prisma.session.create({
    data: {
      userId: input.userId,
      expiresAt: input.expiresAt,
      userAgent: input.userAgent ?? null,
      ipHash: input.ipHash ?? null,
    },
  });

export const findSessionById = (sessionId: string) =>
  prisma.session.findUnique({
    where: { id: sessionId },
  });

export const findSessionWithUserById = (sessionId: string) =>
  prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

export const findActiveSessionById = (sessionId: string, asOf: Date = new Date()) =>
  prisma.session.findFirst({
    where: {
      id: sessionId,
      ...ACTIVE_SESSION_FILTER(asOf),
    },
  });

export const findActiveSessionByUserId = (userId: string, asOf: Date = new Date()) =>
  prisma.session.findFirst({
    where: {
      userId,
      ...ACTIVE_SESSION_FILTER(asOf),
    },
    orderBy: { createdAt: "desc" },
  });

export const revokeSession = (sessionId: string, revokedAt: Date = new Date()) =>
  prisma.session.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
    },
    data: {
      revokedAt,
    },
  });

export const revokeSessionsForUser = (userId: string, revokedAt: Date = new Date()) =>
  prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: { revokedAt },
  });

export const updateSessionExpiry = (sessionId: string, expiresAt: Date) =>
  prisma.session.updateMany({
    where: { id: sessionId },
    data: { expiresAt },
  });

export const deleteExpiredSessions = (asOf: Date = new Date()) =>
  prisma.session.deleteMany({
    where: {
      expiresAt: { lte: asOf },
    },
  });
