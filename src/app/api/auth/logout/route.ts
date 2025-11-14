import { NextResponse } from "next/server";
import { parseSessionIdFromRequest } from "server/auth/cookies";
import { getAuthProvider } from "server/auth/provider";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const POST = withActorFromSession(
  async (req, auth) => {
    const sessionId = parseSessionIdFromRequest(req);
    const provider = getAuthProvider();
    const result = await provider.signOut({
      request: req,
      sessionId,
      actor: auth,
    });
    const response = new NextResponse(null, { status: 204 });
    result.cookies.forEach((cookie) => response.cookies.set(cookie));

    return response;
  },
  { allowAnonymous: true },
);
