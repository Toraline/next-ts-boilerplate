import type { AuditActor, AuditActorType } from "modules/audit";

const ACTOR_TYPE_HEADER = "x-actor-type";
const ACTOR_USER_ID_HEADER = "x-actor-user-id";
const VALID_ACTOR_TYPES = new Set<AuditActorType>([
  "USER",
  "SYSTEM",
  "SERVICE",
  "WEBHOOK",
  "ANONYMOUS",
]);

export function getRequestAuditActor(req: Request): AuditActor | undefined {
  const rawType = req.headers.get(ACTOR_TYPE_HEADER);
  if (!rawType) return undefined;

  const normalizedType = rawType.trim().toUpperCase() as AuditActorType;

  if (!VALID_ACTOR_TYPES.has(normalizedType)) {
    console.warn(`[audit] Ignoring invalid actor type header: ${rawType}`);
    return undefined;
  }

  if (normalizedType === "USER") {
    const userId = req.headers.get(ACTOR_USER_ID_HEADER)?.trim();
    if (!userId) {
      console.warn("[audit] Missing x-actor-user-id header for USER actor");
      return undefined;
    }
    return { type: "USER", userId };
  }

  return { type: normalizedType as Exclude<AuditActorType, "USER"> };
}
