import { NextResponse } from "next/server";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { recordAuditLog } from "modules/audit";
import { buildSessionClearCookie, parseSessionIdFromRequest } from "server/auth/cookies";
import { getClientIp, getUserAgent } from "server/auth/requestUtils";
import { revokeSessionById } from "server/auth/sessionService";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const POST = withActorFromSession(
  async (req, { auth }) => {
    try {
      const sessionId = parseSessionIdFromRequest(req);
      const response = new NextResponse(null, { status: 204 });
      response.cookies.set(buildSessionClearCookie());

      if (auth.session) {
        await revokeSessionById(auth.session.id);
      } else if (sessionId) {
        await revokeSessionById(sessionId);
      }

      await recordAuditLog({
        actorType: auth.actorType,
        actorUserId: auth.actorUserId,
        action: "auth.session.revoked",
        targetType: "session",
        targetId: sessionId ?? "unknown",
        metadata: {
          sessionId: sessionId ?? null,
        },
        ip: getClientIp(req) ?? undefined,
        userAgent: getUserAgent(req) ?? undefined,
      });

      return response;
    } catch (error) {
      return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
    }
  },
  { allowAnonymous: true },
);
