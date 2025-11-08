import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";

export const userStatusSchema = z.enum(["ACTIVE", "INVITED", "SUSPENDED"]);

export const userIdSchema = z.cuid();

export const emailSchema = z.string().trim().email();

export const nameSchema = z
  .string()
  .trim()
  .min(1, VALIDATION_MESSAGES.NAME_TOO_SHORT)
  .max(120, VALIDATION_MESSAGES.NAME_TOO_LONG);

export const avatarUrlSchema = z.string().trim().url();

export const tenantIdSchema = z.string().trim().min(1).max(120);

export const clerkUserIdSchema = z.string().trim().min(1).max(120);

const tenantIdOptionalSchema = tenantIdSchema.optional();
const clerkUserIdOptionalSchema = clerkUserIdSchema.optional();

export const createUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  avatarUrl: avatarUrlSchema.optional(),
  status: userStatusSchema.default("INVITED"),
  tenantId: tenantIdOptionalSchema,
  clerkUserId: clerkUserIdOptionalSchema,
});

const nullableDateSchema = z.union([z.coerce.date(), z.null()]).optional();

const optionalUrlOrNullSchema = z.union([avatarUrlSchema, z.null()]).optional();

const optionalTenantIdOrNullSchema = z.union([tenantIdSchema, z.null()]).optional();
const optionalClerkUserIdOrNullSchema = z.union([clerkUserIdSchema, z.null()]).optional();

export const updateUserSchema = z
  .object({
    email: emailSchema.optional(),
    name: nameSchema.optional(),
    avatarUrl: optionalUrlOrNullSchema,
    status: userStatusSchema.optional(),
    tenantId: optionalTenantIdOrNullSchema,
    clerkUserId: optionalClerkUserIdOrNullSchema,
    lastLoginAt: nullableDateSchema,
    deletedAt: nullableDateSchema,
  })
  .refine(
    (value) =>
      typeof value.name !== "undefined" ||
      typeof value.avatarUrl !== "undefined" ||
      typeof value.status !== "undefined" ||
      typeof value.tenantId !== "undefined" ||
      typeof value.clerkUserId !== "undefined" ||
      typeof value.lastLoginAt !== "undefined" ||
      typeof value.deletedAt !== "undefined",
    { message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED },
  );

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: userStatusSchema.optional(),
  tenantId: tenantIdSchema.optional(),
  email: emailSchema.optional(),
  clerkUserId: clerkUserIdSchema.optional(),
  includeDeleted: z.coerce.boolean().optional(),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "email", "lastLoginAt"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const userEntitySchema = z.object({
  id: userIdSchema,
  email: emailSchema,
  name: nameSchema,
  avatarUrl: avatarUrlSchema.nullable(),
  status: userStatusSchema,
  lastLoginAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  clerkUserId: clerkUserIdSchema.nullable(),
  tenantId: tenantIdSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userPublicSchema = z.object({
  id: userIdSchema,
  email: emailSchema,
  name: nameSchema,
  avatarUrl: avatarUrlSchema.nullable(),
  status: userStatusSchema,
  lastLoginAt: z.string().datetime().nullable(),
  deletedAt: z.string().datetime().nullable(),
  clerkUserId: clerkUserIdSchema.nullable(),
  tenantId: tenantIdSchema.nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const listUsersResponseSchema = z.object({
  items: z.array(userPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});
