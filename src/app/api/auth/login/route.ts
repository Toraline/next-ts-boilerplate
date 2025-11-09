import { NextResponse } from "next/server";
import { ConflictError, NotFoundError, getErrorMessage, getHttpStatus } from "lib/http/errors";
import { recordAuditLog } from "modules/audit";
import * as userRepo from "modules/users/server/repo";
import { trackLoginAttempt } from "server/auth/rateLimit";
import { buildSessionCookie } from "server/auth/cookies";
import { loginRequestSchema, loginResponseSchema } from "server/auth/schemas";
import { getClientIp, getUserAgent } from "server/auth/requestUtils";
import { createUserSession, findActiveSessionByUserId } from "server/auth/sessionService";
import { mapUserToPublic } from "server/auth/userMapper";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req) ?? "unknown";
    trackLoginAttempt(clientIp);

    const raw = await req.json();
    const payload = loginRequestSchema.parse(raw);

    const user =
      payload.email != null
        ? await userRepo.userByEmail(payload.email)
        : await userRepo.userById(payload.userId!);

    if (!user || user.deletedAt) {
      throw new NotFoundError("User not found");
    }

    const activeSession = await findActiveSessionByUserId(user.id);
    if (activeSession) {
      throw new ConflictError("User already has an active session");
    }

    const session = await createUserSession({
      userId: user.id,
      userAgent: getUserAgent(req),
      ipAddress: clientIp === "unknown" ? null : clientIp,
    });

    const responsePayload = loginResponseSchema.parse({
      user: mapUserToPublic(user),
      sessionId: session.id,
    });

    const response = NextResponse.json(responsePayload, { status: 200 });
    response.cookies.set(buildSessionCookie(session.id, session.expiresAt));

    await recordAuditLog({
      actorType: "USER",
      actorUserId: user.id,
      action: "auth.session.created",
      targetType: "session",
      targetId: session.id,
      metadata: {
        sessionId: session.id,
        userId: user.id,
      },
      ip: clientIp === "unknown" ? undefined : clientIp,
      userAgent: getUserAgent(req) ?? undefined,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
