import type { AuditActorType } from "modules/audit";
import { ForbiddenError, UnauthorizedError } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";
import { parseSessionIdFromRequest } from "server/auth/cookies";
import { getAuthProvider } from "server/auth/provider";
import type { AuthProvider } from "server/auth/provider";
import type { SessionWithUser } from "server/db/sessionRepository";

type ActorDetails = {
  actorType: AuditActorType;
  actorUserId?: string;
  session?: SessionWithUser | null;
};

export type ActorFromSessionOptions = {
  allowAnonymous?: boolean;
  allowSystem?: boolean;
};

const ACTOR_TYPE_HEADER = "x-actor-type";
const ACTOR_USER_ID_HEADER = "x-actor-user-id";

function buildAllowedActorTypes(options?: ActorFromSessionOptions) {
  const allowed = new Set<AuditActorType>(["USER"]);

  if (options?.allowAnonymous) allowed.add("ANONYMOUS");

  if (options?.allowSystem) allowed.add("SYSTEM");

  return allowed;
}

async function requireActiveSession(provider: AuthProvider, sessionId: string, now: Date) {
  const session = await provider.getSession({ sessionId, now });

  if (!session) {
    throw new UnauthorizedError("Session expired or revoked");
  }

  return session;
}

function applyActorHeaders(target: Headers | undefined, actor: ActorDetails) {
  if (!target) return;

  target.set(ACTOR_TYPE_HEADER, actor.actorType);

  if (actor.actorType === "USER" && actor.actorUserId) {
    target.set(ACTOR_USER_ID_HEADER, actor.actorUserId);
  } else {
    target.delete(ACTOR_USER_ID_HEADER);
  }
}

function createRequestWithActorHeaders(request: Request, actor: ActorDetails) {
  const headers = new Headers(request.headers);
  applyActorHeaders(headers, actor);
  return new Request(request, { headers });
}

function resolveFallbackActor(options?: ActorFromSessionOptions): ActorDetails {
  if (options?.allowAnonymous) {
    return { actorType: "ANONYMOUS", session: null };
  }

  if (options?.allowSystem) {
    return { actorType: "SYSTEM", session: null };
  }

  throw new UnauthorizedError("Authentication required");
}

type ResolveActorFromHeadersParams = {
  sessionId: string | null;
  allowedActorTypes: Set<AuditActorType>;
  now: Date;
};

async function resolveActorFromHeaders(
  provider: AuthProvider,
  actor: ReturnType<typeof getRequestAuditActor>,
  { sessionId, allowedActorTypes, now }: ResolveActorFromHeadersParams,
): Promise<ActorDetails> {
  if (!actor) {
    throw new UnauthorizedError("Unable to resolve actor from headers");
  }

  if (!allowedActorTypes.has(actor.type)) {
    throw new ForbiddenError(`Actor type ${actor.type} is not allowed for this operation`);
  }

  if (actor.type !== "USER") {
    return {
      actorType: actor.type,
      session: null,
    };
  }

  if (!actor.userId) {
    throw new UnauthorizedError("Missing actor user id");
  }

  if (!sessionId) {
    return {
      actorType: "USER",
      actorUserId: actor.userId,
      session: null,
    };
  }

  const session = await requireActiveSession(provider, sessionId, now);

  if (session.userId !== actor.userId) {
    throw new ForbiddenError("Session does not belong to provided actor");
  }

  return {
    actorType: "USER",
    actorUserId: actor.userId,
    session,
  };
}

type ResolveActorFromSessionParams = {
  sessionId: string | null;
  now: Date;
  options?: ActorFromSessionOptions;
};

async function resolveActorFromSessionOrFallback({
  provider,
  sessionId,
  now,
  options,
}: ResolveActorFromSessionParams & { provider: AuthProvider }): Promise<ActorDetails> {
  if (!sessionId) {
    return resolveFallbackActor(options);
  }

  const session = await provider.getSession({ sessionId, now });
  if (session) {
    return {
      actorType: "USER",
      actorUserId: session.userId,
      session,
    };
  }

  if (options?.allowAnonymous || options?.allowSystem) {
    return resolveFallbackActor(options);
  }

  throw new UnauthorizedError("Session expired or revoked");
}

type ResolveActorParams = {
  request: Request;
  sessionId: string | null;
  allowedActorTypes: Set<AuditActorType>;
  now: Date;
  options?: ActorFromSessionOptions;
};

async function resolveActorDetails({
  provider,
  request,
  sessionId,
  allowedActorTypes,
  now,
  options,
}: ResolveActorParams & { provider: AuthProvider }): Promise<ActorDetails> {
  const actorFromHeaders = getRequestAuditActor(request);

  if (actorFromHeaders) {
    return resolveActorFromHeaders(provider, actorFromHeaders, {
      sessionId,
      allowedActorTypes,
      now,
    });
  }

  return resolveActorFromSessionOrFallback({
    provider,
    sessionId,
    now,
    options,
  });
}

type ActorRouteParams = Record<string, string | string[]>;

type ActorRouteHandler<TParams extends ActorRouteParams> = (
  request: Request,
  auth: ActorDetails,
  context: { params: TParams },
) => Response | Promise<Response>;

export function withActorFromSession<TParams extends ActorRouteParams = Record<string, never>>(
  handler: ActorRouteHandler<TParams>,
  options?: ActorFromSessionOptions,
) {
  return async (request: Request, context: { params: TParams }) => {
    const allowedActorTypes = buildAllowedActorTypes(options);
    const sessionId = parseSessionIdFromRequest(request);
    const now = new Date();
    const authProvider = getAuthProvider();

    const actorDetails = await resolveActorDetails({
      provider: authProvider,
      request,
      sessionId,
      allowedActorTypes,
      now,
      options,
    });

    const actorAwareRequest = createRequestWithActorHeaders(request, actorDetails);
    const resolvedContext = context ?? ({ params: {} } as { params: TParams });

    const response = await handler(actorAwareRequest, actorDetails, resolvedContext);
    applyActorHeaders(response?.headers, actorDetails);

    return response;
  };
}
