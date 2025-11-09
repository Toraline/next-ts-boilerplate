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

export function withActorFromSession<TContext extends Record<string, unknown>>(
  handler: RouteHandler<WithActorContext<TContext>>,
  options?: ActorFromSessionOptions,
): RouteHandler<TContext> {
  return async (req: Request, context: TContext) => {
    const allowedTypes: Set<AuditActorType> = new Set(["USER"]);
    if (options?.allowAnonymous) allowedTypes.add("ANONYMOUS");
    if (options?.allowSystem) allowedTypes.add("SYSTEM");

    const existingActor = getRequestAuditActor(req);
    const sessionId = parseSessionIdFromRequest(req);
    const now = new Date();

    let resolvedSession: SessionWithUser | null = null;
    let actorDetails: ActorDetails | null = null;

    if (existingActor) {
      if (!allowedTypes.has(existingActor.type)) {
        throw new ForbiddenError(
          `Actor type ${existingActor.type} is not allowed for this operation`,
        );
      }

      if (existingActor.type === "USER") {
        if (!existingActor.userId) {
          throw new UnauthorizedError("Missing actor user id");
        }

        if (sessionId) {
          const session = await getActiveSessionContext(sessionId, now);
          if (!session) {
            throw new UnauthorizedError("Session expired or revoked");
          }

          if (session.userId !== existingActor.userId) {
            throw new ForbiddenError("Session does not belong to provided actor");
          }

          resolvedSession = session;
        }

        actorDetails = {
          actorType: "USER",
          actorUserId: existingActor.userId,
          session: resolvedSession,
        };
      } else {
        actorDetails = {
          actorType: existingActor.type,
          actorUserId: undefined,
          session: null,
        };
      }
    } else {
      if (sessionId) {
        const session = await getActiveSessionContext(sessionId, now);
        if (!session) {
          if (options?.allowAnonymous) {
            actorDetails = {
              actorType: "ANONYMOUS",
              session: null,
            };
          } else if (options?.allowSystem) {
            actorDetails = {
              actorType: "SYSTEM",
              session: null,
            };
          } else {
            throw new UnauthorizedError("Session expired or revoked");
          }
        } else {
          resolvedSession = session;
          actorDetails = {
            actorType: "USER",
            actorUserId: session.userId,
            session,
          };
        }
      } else if (options?.allowAnonymous) {
        actorDetails = {
          actorType: "ANONYMOUS",
          session: null,
        };
      } else if (options?.allowSystem) {
        actorDetails = {
          actorType: "SYSTEM",
          session: null,
        };
      } else {
        throw new UnauthorizedError("Authentication required");
      }
    }

    if (!actorDetails) {
      throw new UnauthorizedError("Unable to resolve actor");
    }

    const headers = new Headers(req.headers);
    headers.set(ACTOR_TYPE_HEADER, actorDetails.actorType);
    if (actorDetails.actorType === "USER" && actorDetails.actorUserId) {
      headers.set(ACTOR_USER_ID_HEADER, actorDetails.actorUserId);
    } else {
      headers.delete(ACTOR_USER_ID_HEADER);
    }

    const actorRequest = new Request(req.clone(), { headers });

    const nextContext = {
      ...(context as object),
      auth: actorDetails,
    } as WithActorContext<TContext>;

    const response = await handler(actorRequest, nextContext);

    if (response?.headers) {
      response.headers.set(ACTOR_TYPE_HEADER, actorDetails.actorType);
      if (actorDetails.actorType === "USER" && actorDetails.actorUserId) {
        response.headers.set(ACTOR_USER_ID_HEADER, actorDetails.actorUserId);
      } else {
        response.headers.delete(ACTOR_USER_ID_HEADER);
      }
    }

    return response;
  };
}
