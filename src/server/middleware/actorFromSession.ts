import { NextResponse } from "next/server";
import type { AuditActorType } from "modules/audit";
import { ForbiddenError, UnauthorizedError, getErrorMessage, getHttpStatus } from "lib/http/errors";
import { getRequestAuditActor } from "lib/http/audit-actor";
import { parseSessionIdFromRequest } from "server/auth/cookies";
import { getAuthProvider } from "server/auth/provider";
import type { AuthProvider } from "server/auth/provider";
import type { SessionWithUser } from "server/db/sessionRepository";

export type ActorDetails = {
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

function getAllowedActorTypes(options?: ActorFromSessionOptions) {
  const allowed = new Set<AuditActorType>(["USER"]);

  if (options?.allowAnonymous) allowed.add("ANONYMOUS");

  if (options?.allowSystem) allowed.add("SYSTEM");

  return allowed;
}

async function getActiveSessionOrThrow(provider: AuthProvider, sessionId: string, now: Date) {
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

function createRequestWithActorHeaders(request: Request, actor: ActorDetails): Request {
  const headers = new Headers(request.headers);
  applyActorHeaders(headers, actor);
  return new Request(request, { headers });
}

function resolveAnonymousOrSystemActor(options?: ActorFromSessionOptions): ActorDetails {
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

  const session = await getActiveSessionOrThrow(provider, sessionId, now);

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

async function resolveActorFromSession({
  provider,
  sessionId,
  now,
  options,
}: ResolveActorFromSessionParams & { provider: AuthProvider }): Promise<ActorDetails> {
  if (!sessionId) {
    return resolveAnonymousOrSystemActor(options);
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
    return resolveAnonymousOrSystemActor(options);
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
  const actorInHeaders = getRequestAuditActor(request);

  if (actorInHeaders) {
    return resolveActorFromHeaders(provider, actorInHeaders, {
      sessionId,
      allowedActorTypes,
      now,
    });
  }

  return resolveActorFromSession({
    provider,
    sessionId,
    now,
    options,
  });
}

type RouteParams = Record<string, string | string[]>;

type ActorRouteHandler<TRouteParams extends RouteParams> = (
  request: Request,
  auth: ActorDetails,
  context: { params: Promise<TRouteParams> },
) => Response | Promise<Response>;

type WithActorFromSessionFn = {
  (
    routeHandler: ActorRouteHandler<Record<string, never>>,
    options?: ActorFromSessionOptions,
  ): (request: Request) => Promise<Response>;
  <TRouteParams extends RouteParams>(
    routeHandler: ActorRouteHandler<TRouteParams>,
    options?: ActorFromSessionOptions,
  ): (request: Request, context: { params: Promise<TRouteParams> }) => Promise<Response>;
};

function createWithActorFromSession<TRouteParams extends RouteParams = Record<string, never>>(
  routeHandler: ActorRouteHandler<TRouteParams>,
  options?: ActorFromSessionOptions,
) {
  const handleRequest = async (
    request: Request,
    nextJsContext?: { params: Promise<TRouteParams> },
  ) => {
    try {
      const allowedActorTypes = getAllowedActorTypes(options);
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

      const requestWithActorHeaders = createRequestWithActorHeaders(request, actorDetails);

      const routeContext = nextJsContext ?? { params: Promise.resolve({} as TRouteParams) };
      const response = await routeHandler(requestWithActorHeaders, actorDetails, routeContext);
      applyActorHeaders(response?.headers, actorDetails);
      return response;
    } catch (error) {
      return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
    }
  };

  // Next.js route handlers can have 2 signatures: (request) or (request, { params }).
  // We use Function.length to detect which signature the routeHandler expects.
  // If routeHandler.length < 3, it doesn't expect the context argument (no dynamic route segments).
  if (routeHandler.length < 3) {
    return async (request: Request) => handleRequest(request);
  }

  return async (request: Request, context: { params: Promise<TRouteParams> }) =>
    handleRequest(request, context);
}

export const withActorFromSession = createWithActorFromSession as WithActorFromSessionFn;
