import type { AuditActorType } from "modules/audit";
import { ForbiddenError, UnauthorizedError } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";
import { parseSessionIdFromRequest } from "server/auth/cookies";
import { getActiveSessionContext } from "server/auth/sessionService";
import type { SessionWithUser } from "server/db/sessionRepository";

type ActorDetails = {
  actorType: AuditActorType;
  actorUserId?: string;
  session?: SessionWithUser | null;
};

type WithActorContext<T> = T & { auth: ActorDetails };

type RouteHandler<TContext> = (req: Request, context: TContext) => Response | Promise<Response>;

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

async function requireActiveSession(sessionId: string, now: Date) {
  const session = await getActiveSessionContext(sessionId, now);
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

  const session = await requireActiveSession(sessionId, now);

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
  sessionId,
  now,
  options,
}: ResolveActorFromSessionParams): Promise<ActorDetails> {
  if (!sessionId) {
    return resolveFallbackActor(options);
  }

  const session = await getActiveSessionContext(sessionId, now);
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
  request,
  sessionId,
  allowedActorTypes,
  now,
  options,
}: ResolveActorParams): Promise<ActorDetails> {
  const actorFromHeaders = getRequestAuditActor(request);

  if (actorFromHeaders) {
    return resolveActorFromHeaders(actorFromHeaders, {
      sessionId,
      allowedActorTypes,
      now,
    });
  }

  return resolveActorFromSessionOrFallback({
    sessionId,
    now,
    options,
  });
}

export function withActorFromSession<TContext extends Record<string, unknown>>(
  handler: RouteHandler<WithActorContext<TContext>>,
  options?: ActorFromSessionOptions,
): RouteHandler<TContext> {
  return async (request: Request, context: TContext) => {
    const allowedActorTypes = buildAllowedActorTypes(options);
    const sessionId = parseSessionIdFromRequest(request);
    const now = new Date();

    const actorDetails = await resolveActorDetails({
      request,
      sessionId,
      allowedActorTypes,
      now,
      options,
    });

    const actorAwareRequest = createRequestWithActorHeaders(request, actorDetails);
    const nextContext = {
      ...(context as object),
      auth: actorDetails,
    } as WithActorContext<TContext>;

    const response = await handler(actorAwareRequest, nextContext);
    applyActorHeaders(response?.headers, actorDetails);

    return response;
  };
}
