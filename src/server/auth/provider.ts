import { z } from "zod";
import type { AuditActorType } from "modules/audit/schema";
import type { SessionWithUser } from "server/db/sessionRepository";
import type { SessionCookieDefinition } from "server/auth/cookies";
import { createFakeAuthProvider } from "./providers/fakeProvider";
import { userPublicSchema } from "modules/users/schema";

export type AuthProviderName = "FAKE";

export type PublicUser = z.infer<typeof userPublicSchema>;

export type AuthSessionSummary = {
  id: string;
  expiresAt: Date;
};

export type SignInParams = {
  request: Request;
  body: unknown;
};

export type SignInResult = {
  user: PublicUser;
  session: AuthSessionSummary;
  cookies: SessionCookieDefinition[];
};

export type SignOutParams = {
  request: Request;
  sessionId: string | null;
  actor: {
    actorType: AuditActorType;
    actorUserId?: string;
    session?: SessionWithUser | null;
  };
};

export type SignOutResult = {
  cookies: SessionCookieDefinition[];
};

export type GetSessionParams = {
  sessionId: string;
  now?: Date;
};

export type AuthProvider = {
  name: AuthProviderName;
  signIn(params: SignInParams): Promise<SignInResult>;
  signOut(params: SignOutParams): Promise<SignOutResult>;
  signUp(params: { request: Request; body: unknown }): Promise<never>;
  getSession(params: GetSessionParams): Promise<SessionWithUser | null>;
  getUser(userId: string): Promise<PublicUser | null>;
  isEmailVerified(userId: string): Promise<boolean>;
};

let cachedProvider: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
  if (cachedProvider) return cachedProvider;

  const rawProvider = process.env.AUTH_PROVIDER?.toUpperCase() as AuthProviderName | undefined;
  const providerName: AuthProviderName = rawProvider ?? "FAKE";

  switch (providerName) {
    case "FAKE":
      cachedProvider = createFakeAuthProvider();
      return cachedProvider;
    default:
      throw new Error(`Unsupported auth provider: ${providerName}`);
  }
}

export function resetAuthProviderCache() {
  cachedProvider = null;
}
