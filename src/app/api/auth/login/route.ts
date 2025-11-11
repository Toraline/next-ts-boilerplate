import { NextResponse } from "next/server";
import { getErrorMessage, getHttpStatus } from "lib/http/errors";
import { loginResponseSchema } from "server/auth/schemas";
import { getAuthProvider } from "server/auth/provider";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const provider = getAuthProvider();
    const signInResult = await provider.signIn({ request: req, body: raw });
    const responsePayload = loginResponseSchema.parse({
      user: signInResult.user,
      sessionId: signInResult.session.id,
    });
    const response = NextResponse.json(responsePayload, { status: 200 });
    signInResult.cookies.forEach((cookie) => response.cookies.set(cookie));

    return response;
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
