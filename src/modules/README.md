🚀 Boilerplate Guide — Modules, Files, and How to Add a New Feature

This repo uses Next.js (App Router) + PostgreSQL + Prisma + Zod with a module-per-feature architecture.
Each feature (e.g. categories) is a self-contained module with schemas, server code (service/repo), and UI.
APIs (App Router) are thin wrappers that call the service layer.

🗂️ Folder structure (overview)
src/
  app/
    api/
      <feature>/
        route.ts               # GET list, POST create
      <feature>/[idOrSlug]/
        route.ts               # GET one, PATCH update, DELETE delete
    <feature>/
      page.tsx                 # List page (server component)
      new/page.tsx             # Create page (client component)
      [idOrSlug]/page.tsx      # Detail page (server component)
      [idOrSlug]/edit/page.tsx # Edit page (client component)
  lib/
    prisma.ts                  # Prisma client singleton
    errors.ts                  # Typed HttpError, helpers (status + message)
  modules/
    <feature>/
      schemas.ts               # Zod: inputs, outputs, shared contracts
      server/
        repo.ts                # DB access (Prisma only; no business rules)
        service.ts             # Use-cases: validate IO, business rules
      ui/                      # (Optional now) React components
  global/
    styles/

💡 Philosophy

Single Source of Truth: Zod schemas define inputs (API payloads, form data) and outputs (API responses).

Separation of Concerns:

repo: DB-only queries (Prisma). No business rules or validation.

service: Business rules, Zod validation/parsing, formatting outputs (e.g., Date → ISO), error throwing.

route.ts: HTTP boundary. Parse query string into a plain object and call the service. Return responses with correct status codes.

Deterministic Routing: Dynamic routes accept id or slug. We use Option A: forbid slugs that look like IDs to remove ambiguity.

Safer Errors: Custom HttpError subclasses carry status, and helpers convert unknown errors into messages + HTTP codes.

🧩 What each file does
src/lib/prisma.ts

Prisma client singleton with dev-friendly logging.

src/lib/errors.ts

HttpError (base), NotFoundError, ConflictError, BadRequestError

getHttpStatus(err) → number

getErrorMessage(err) → user-friendly message

Centralizes error mapping from Zod/Prisma/custom to HTTP.

src/modules/<feature>/schemas.ts

Zod contracts for this feature:

Inputs:

create<Feature>Schema

update<Feature>Schema (PATCH: fields optional, refine ensures at least one present)

list<Feature>QuerySchema (page, pageSize, search, sort)

Outputs:

<feature>EntitySchema (Prisma row with Date)

<feature>PublicSchema (API response with ISO strings via z.iso.datetime())

list<Feature>ResponseSchema (items, total, page, pageSize)

Shared:

idSchema = z.cuid()

slugSchema with Option A rule: forbid CUID-shaped slugs

idOrSlugSchema = z.union([idSchema, slugSchema]) (collision-free)

src/modules/<feature>/server/repo.ts

Pure Prisma queries:

findMany (with filters/sort/pagination)

findById / findBySlug

create, update, delete

Receives already-validated arguments (or well-typed primitives).

src/modules/<feature>/server/service.ts

Validates all inputs with Zod (never trust raw).

Applies business rules (e.g., unique slug check).

Converts DB entities → public payloads (ISO dates).

Throws typed errors (NotFoundError, ConflictError) for routes to translate into HTTP statuses.

Keeps API routes thin and consistent.

src/app/api/<feature>/…/route.ts

Calls service functions.

On error: uses getHttpStatus + getErrorMessage.

DELETE returns new Response(null, { status: 204 }) (no body).

Uses Web Response for bodyless statuses; NextResponse.json() for JSON bodies.

Pages under src/app/<feature>/…

List page (page.tsx): server component, fetches /api/<feature> with cache: "no-store".

New page (new/page.tsx): client form that POSTs JSON to the API.

Detail page ([idOrSlug]/page.tsx): server component showing one item.

Edit page ([idOrSlug]/edit/page.tsx): client form that PATCHes JSON (no-op tolerant, see below).

🛠️ How to create a new module (step-by-step)

Assume a new module: tags

1) Prisma model
model Tag {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

npx prisma migrate dev -n "tags"

2) Zod schemas — src/modules/tags/schemas.ts
import { z } from "zod";

// IDs & slugs
const isCuid = (s: string) => z.cuid().safeParse(s).success;
export const idSchema = z.cuid();
export const slugSchema = z
  .string()
  .min(3)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .refine((s) => !isCuid(s), "Slug cannot be a CUID");
export const idOrSlugSchema = z.union([idSchema, slugSchema]);

// Inputs
const nameSchema = z.string().min(2).max(80).trim();
export const descriptionSchema = z.string().max(500).optional();

export const createTagSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema,
});

export const updateTagSchema = z.object({
  name: nameSchema.optional(),
  slug: slugSchema.optional(),
  description: descriptionSchema, // "" preserved
}).refine(
  (v) =>
    typeof v.name !== "undefined" ||
    typeof v.slug !== "undefined" ||
    typeof v.description !== "undefined",
  { message: "At least one field to update is required" }
);

export const listTagsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "updatedAt", "slug"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

// Outputs
export const tagEntitySchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: nameSchema,
  description: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const tagPublicSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: nameSchema,
  description: z.string().nullable().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const listTagsResponseSchema = z.object({
  items: z.array(tagPublicSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

3) Repo — src/modules/tags/server/repo.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { listTagsQuerySchema } from "../schemas";

export async function tagFindMany(raw: unknown) {
  const { page, pageSize, search, sortBy, sortDir } = listTagsQuerySchema.parse(raw);

  const where: Prisma.TagWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.tag.findMany({
      where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { [sortBy]: sortDir },
    }),
    prisma.tag.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export const tagById = (id: string) => prisma.tag.findUnique({ where: { id } });
export const tagBySlug = (slug: string) => prisma.tag.findUnique({ where: { slug } });
export const tagCreate = (data: { slug: string; name: string; description?: string }) =>
  prisma.tag.create({ data });
export const tagUpdate = (id: string, data: Prisma.TagUpdateInput) =>
  prisma.tag.update({ where: { id }, data });
export const tagDelete = (id: string) =>
  prisma.tag.delete({ where: { id } });

4) Service — src/modules/tags/server/service.ts
import {
  tagEntitySchema,
  tagPublicSchema,
  listTagsQuerySchema,
  listTagsResponseSchema,
  createTagSchema,
  updateTagSchema,
  idSchema,
  slugSchema,
} from "../schemas";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { tagFindMany, tagById, tagBySlug, tagCreate, tagUpdate, tagDelete } from "./repo";

function toPublic(row: unknown) {
  const e = tagEntitySchema.parse(row);
  return tagPublicSchema.parse({
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  });
}

export async function listTags(rawQuery: unknown) {
  const qp = listTagsQuerySchema.parse(rawQuery);
  const res = await tagFindMany(qp);
  return listTagsResponseSchema.parse({ ...res, items: res.items.map(toPublic) });
}

export async function getTagByIdOrSlug(idOrSlug: string) {
  const isId = idSchema.safeParse(idOrSlug).success;
  const isSlug = !isId && slugSchema.safeParse(idOrSlug).success;
  const row = isId ? await tagById(idOrSlug) : isSlug ? await tagBySlug(idOrSlug) : null;
  if (!row) throw new NotFoundError();
  return toPublic(row);
}

export async function createTag(raw: unknown) {
  const input = createTagSchema.parse(raw);
  const exists = await tagBySlug(input.slug);
  if (exists) throw new ConflictError("Slug already exists");
  const created = await tagCreate({
    name: input.name.trim(),
    slug: input.slug,
    description: typeof input.description === "string" ? input.description : undefined,
  });
  return toPublic(created);
}

export async function updateTagByIdOrSlug(idOrSlug: string, rawPatch: unknown) {
  const isId = idSchema.safeParse(idOrSlug).success;
  const isSlug = !isId && slugSchema.safeParse(idOrSlug).success;

  const current = isId ? await tagById(idOrSlug) : isSlug ? await tagBySlug(idOrSlug) : null;
  if (!current) throw new NotFoundError();

  const patch = updateTagSchema.parse(rawPatch);

  if (typeof patch.slug !== "undefined" && patch.slug !== current.slug) {
    const exist = await tagBySlug(patch.slug);
    if (exist) throw new ConflictError("Slug already exists");
  }

  const prismaPatch: Record<string, unknown> = {};
  if (typeof patch.name !== "undefined") prismaPatch.name = patch.name.trim();
  if (typeof patch.slug !== "undefined") prismaPatch.slug = patch.slug;
  if (typeof patch.description !== "undefined") prismaPatch.description = patch.description;

  // (Optional) detect no-op and short-circuit with current resource or 204
  const updated = await tagUpdate(current.id, prismaPatch);
  return toPublic(updated);
}

export async function deleteTagByIdOrSlug(idOrSlug: string) {
  const isId = idSchema.safeParse(idOrSlug).success;
  const isSlug = !isId && slugSchema.safeParse(idOrSlug).success;

  const current = isId ? await tagById(idOrSlug) : isSlug ? await tagBySlug(idOrSlug) : null;
  if (!current) throw new NotFoundError();

  await tagDelete(current.id);
}

5) Routes — src/app/api/tags/.../route.ts
// route.ts
import { NextResponse } from "next/server";
import { listTags, createTag } from "@/modules/tags/server/service";
import { getErrorMessage, getHttpStatus } from "@/lib/errors";

export async function GET(req: Request) {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams.entries());
    const data = await listTags(params);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const created = await createTag(json);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) });
  }
}

// [idOrSlug]/route.ts
import { NextResponse } from "next/server";
import { getTagByIdOrSlug, updateTagByIdOrSlug, deleteTagByIdOrSlug } from "@/modules/tags/server/service";
import { getErrorMessage, getHttpStatus } from "@/lib/errors";

export async function GET(_: Request, { params }: { params: { idOrSlug: string } }) {
  try { return NextResponse.json(await getTagByIdOrSlug(params.idOrSlug)); }
  catch (e) { return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) }); }
}

export async function PATCH(req: Request, { params }: { params: { idOrSlug: string } }) {
  try {
    const json = await req.json();
    return NextResponse.json(await updateTagByIdOrSlug(params.idOrSlug, json));
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) });
  }
}

export async function DELETE(_: Request, { params }: { params: { idOrSlug: string } }) {
  try { await deleteTagByIdOrSlug(params.idOrSlug); return new Response(null, { status: 204 }); }
  catch (e) { return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) }); }
}

6) Pages (copy from categories and adjust)

/tags list, /tags/new, /tags/[idOrSlug], /tags/[idOrSlug]/edit