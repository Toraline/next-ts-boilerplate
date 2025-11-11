export const SESSION_COOKIE_NAME = "s_session";

export type SessionCookieDefinition = {
  name: string;
  value: string;
  httpOnly: boolean;
  sameSite: "lax";
  path: string;
  secure: boolean;
  expires?: Date;
  maxAge?: number;
};

function shouldUseSecureCookie(override?: boolean) {
  // Allows tests/dev environments to opt-out; defaults to Secure when running in production.
  if (typeof override === "boolean") return override;
  return process.env.NODE_ENV === "production";
}

function baseCookieConfig(secure?: boolean) {
  const resolvedSecure = shouldUseSecureCookie(secure);
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: resolvedSecure,
  };
}

export function buildSessionCookie(
  sessionId: string,
  expiresAt: Date,
  options?: { secure?: boolean },
): SessionCookieDefinition {
  return {
    ...baseCookieConfig(options?.secure),
    value: sessionId,
    expires: expiresAt,
  };
}

export function buildSessionClearCookie(options?: { secure?: boolean }): SessionCookieDefinition {
  return {
    ...baseCookieConfig(options?.secure),
    value: "",
    expires: new Date(0),
    maxAge: 0,
  };
}

export function parseSessionIdFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const match = cookies.find((cookie) => {
    if (!cookie) return false;
    const [name] = cookie.split("=");
    return name === SESSION_COOKIE_NAME;
  });

  if (!match) return null;

  const [, ...valueParts] = match.split("=");
  const rawValue = valueParts.join("=");
  if (!rawValue) return null;

  try {
    return decodeURIComponent(rawValue);
  } catch {
    return rawValue;
  }
}
