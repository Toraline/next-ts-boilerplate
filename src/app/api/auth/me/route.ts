import { NextResponse } from "next/server";
import { UnauthorizedError, getErrorMessage, getHttpStatus } from "lib/http/errors";
import { parseSessionIdFromRequest } from "server/auth/cookies";
import { meResponseSchema } from "server/auth/schemas";
import { getActiveSessionContext } from "server/auth/sessionService";
import { mapUserToPublic } from "server/auth/userMapper";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const sessionId = parseSessionIdFromRequest(req);
    if (!sessionId) {
      throw new UnauthorizedError("Session not found");
    }

    const session = await getActiveSessionContext(sessionId);
    if (!session) {
      throw new UnauthorizedError("Session expired or revoked");
    }

    const responsePayload = meResponseSchema.parse({
      user: mapUserToPublic(session.user),
    });

    const response = NextResponse.json(responsePayload, { status: 200 });
    response.headers.set("x-actor-type", "USER");
    response.headers.set("x-actor-user-id", session.userId);

    return response;
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}

