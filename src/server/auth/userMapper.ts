import { userEntitySchema, userPublicSchema } from "modules/users/schema";

export function mapUserToPublic(raw: unknown) {
  const entity = userEntitySchema.parse(raw);

  return userPublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    lastLoginAt: entity.lastLoginAt ? entity.lastLoginAt.toISOString() : null,
    deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
  });
}
