import * as userService from "modules/users/server/service";
import { withActorFromSession } from "server/middleware/actorFromSession";
import { getRequestAuditActor } from "lib/http/audit-actor";

export const runtime = "nodejs";

export const DELETE = withActorFromSession(async (req, _auth, { params }) => {
  const { userId, permissionId } = await params;
  const actor = getRequestAuditActor(req);
  await userService.removePermissionFromUser(userId, permissionId, actor ? { actor } : undefined);
  return new Response(null, { status: 204 });
});
