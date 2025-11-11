import { createHash } from "crypto";
import type { SessionWithUser } from "server/db/sessionRepository";
import {
  createSession,
  deleteExpiredSessions,
  findActiveSessionById,
  findActiveSessionByUserId,
  findSessionWithUserById,
  revokeSession,
  updateSessionExpiry,
} from "server/db/sessionRepository";

const DEFAULT_SESSION_TTL_MINUTES = 60 * 24; // 24 hours

export function computeSessionExpiry(ttlMinutes: number = DEFAULT_SESSION_TTL_MINUTES) {
  return new Date(Date.now() + ttlMinutes * 60_000);
}

export function hashIpAddress(ip?: string | null) {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex");
}

export async function createUserSession(input: {
  userId: string;
  ttlMinutes?: number;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  const expiresAt = computeSessionExpiry(input.ttlMinutes);

  return createSession({
    userId: input.userId,
    expiresAt,
    userAgent: input.userAgent ?? null,
    ipHash: hashIpAddress(input.ipAddress),
  });
}

export { findActiveSessionById, findActiveSessionByUserId, findSessionWithUserById };

export function revokeSessionById(sessionId: string) {
  return revokeSession(sessionId);
}

export function forceExpireSession(sessionId: string, expiresAt: Date) {
  return updateSessionExpiry(sessionId, expiresAt);
}

export function purgeExpiredSessions(asOf: Date = new Date()) {
  return deleteExpiredSessions(asOf);
}

export function isSessionActive(session: SessionWithUser, asOf: Date = new Date()) {
  if (session.revokedAt) return false;

  if (session.expiresAt <= asOf) return false;

  if (session.user.deletedAt) return false;

  return true;
}

export async function getActiveSessionContext(sessionId: string, asOf: Date = new Date()) {
  const session = await findSessionWithUserById(sessionId);

  if (!session) return null;

  if (!isSessionActive(session, asOf)) return null;

  return session;
}
