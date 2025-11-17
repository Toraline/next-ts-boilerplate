import { NextResponse } from "next/server";
import { meResponseSchema } from "server/auth/schemas";
import { mapUserToPublic } from "server/auth/userMapper";
import { withActorFromSession } from "server/middleware/actorFromSession";

export const runtime = "nodejs";

export const GET = withActorFromSession(
  async (_req, auth) => {
    if (!auth.session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const responsePayload = meResponseSchema.parse({
      user: mapUserToPublic(auth.session.user),
    });

    return NextResponse.json(responsePayload, { status: 200 });
  },
  { allowAnonymous: true },
);
