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
    client/                    # Client-side utilities
      ├── errors.ts            # Client-side error handling with ApiError class
      └── react-query.tsx      # React Query provider
    database/                  # Database utilities
      └── prisma.ts            # Prisma client singleton
    http/                      # HTTP/API utilities
      ├── api.ts               # Fetch wrapper
      └── errors.ts            # Server-side error handling with HttpError classes
    validation/                # Validation utilities
      └── form-validation.ts   # Form validation helpers
    utils/                     # General utilities
      └── getUrl.ts            # URL construction utility
    constants/                 # Global constants organized by purpose
      ├── index.ts             # Barrel export for all constants
      ├── api.ts               # API_URL and related constants
      ├── errors.ts            # Generic client error messages (CLIENT_ERROR_MESSAGES)
      └── validation.ts        # Schema validation messages (VALIDATION_MESSAGES)
  modules/
    <feature>/
      schema.ts                # Zod: inputs, outputs, shared contracts (uses lib constants)
      types.ts                 # TypeScript types inferred from Zod schemas
      constants/               # Feature-specific constants
        ├── index.ts           # Barrel export: <FEATURE>_UI, <FEATURE>_ERRORS
        ├── errors.ts          # Feature error messages (<FEATURE>_ERRORS)
        └── ui.ts              # Feature UI text (<FEATURE>_UI)
      server/
        repo.ts                # DB access (Prisma only; no business rules)
        service.ts             # Use-cases: validate IO, business rules
      hooks/
        index.ts               # Barrel export for all hooks
        use<Feature>List.ts    # React Query hooks for client-side data fetching
      components/              # Feature-specific UI components
        └── <Component>/        # Component folder with .tsx and .css files
      views/                   # Feature views/pages
        ├── <View>.tsx         # View component
        └── <View>.style.css   # View-specific styles (imported by the view)
  global/
    constants/                 # Global UI constants
      ├── index.ts             # Barrel export
      └── ui.ts                # Generic UI text (GLOBAL_UI)
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

**Database Layer**
`src/lib/database/prisma.ts` - Prisma client singleton with dev-friendly logging.

**HTTP Layer**
`src/lib/http/api.ts` - Generic fetch wrapper with error handling and TypeScript support.
`src/lib/http/errors.ts` - Server-side HTTP error handling: HttpError (base), NotFoundError, ConflictError, BadRequestError, getHttpStatus(err) → number, getErrorMessage(err) → user-friendly message. Centralizes error mapping from Zod/Prisma/custom to HTTP.

**Client Layer**
`src/lib/client/errors.ts` - Client-side error handling with ApiError class and generic error processing.
`src/lib/client/react-query.tsx` - React Query provider with global error handling and retry logic.

**Utilities**
`src/lib/utils/getUrl.ts` - URL construction utility with environment detection.
`src/lib/validation/form-validation.ts` - Form validation helpers for Zod error processing.

src/modules/<feature>/schema.ts

Zod contracts for this feature (uses constants from lib/constants/validation.ts):

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

slugSchema with Option A rule: forbid CUID-shaped slugs (uses VALIDATION_MESSAGES)

idOrSlugSchema = z.union([idSchema, slugSchema]) (collision-free)

All validation messages now use constants from lib/constants/validation.ts:
```typescript
import { VALIDATION_MESSAGES } from "lib/constants";

export const slugSchema = z
  .string()
  .min(3, VALIDATION_MESSAGES.SLUG_MIN_LENGTH)
  .max(60, VALIDATION_MESSAGES.SLUG_MAX_LENGTH)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, VALIDATION_MESSAGES.SLUG_FORMAT);
```

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

src/modules/<feature>/types.ts

TypeScript types inferred from Zod schemas:

<Feature> = z.infer<typeof <feature>PublicSchema>

List<Feature>Response = z.infer<typeof list<Feature>ResponseSchema>

List<Feature>Query = z.infer<typeof list<Feature>QuerySchema>

Provides type safety for client-side code and React Query hooks.

src/modules/<feature>/hooks/

React Query hooks for complete CRUD operations with caching, error handling, and loading states:

- use<Feature>List() — fetches paginated list with search, sort, and pagination
- use<Feature>() — fetches single item by ID or slug  
- useCreate<Feature>() — mutation for creating new items
- useUpdate<Feature>() — mutation for updating existing items
- useDelete<Feature>() — mutation for deleting items

Each hook file exports a single hook with consistent naming patterns.

index.ts provides barrel exports: export * from "./use<Feature>List", etc.

Hooks use the generic useListQuery and useMutation patterns from global/hooks for consistency.

Features include:
- Smart retry logic (no retries on 404s)
- Automatic cache invalidation
- Proper TypeScript typing with ApiError handling
- Loading states and error boundaries

src/modules/<feature>/constants/

Feature-specific constants organized for i18n readiness:

- index.ts — Barrel export for <FEATURE>_UI and <FEATURE>_ERRORS
- errors.ts — Error messages (<FEATURE>_ERRORS) with UPPERCASE naming
- ui.ts — UI text and labels (<FEATURE>_UI) with organized nested structure

Constants follow UPPERCASE naming convention and are organized alphabetically:
```typescript
export const CATEGORIES_UI = {
  EMPTY_STATES: {
    CATEGORY_NOT_FOUND: "Category not found",
    NO_CATEGORIES_FOUND: "No categories found",
  },
  HEADERS: {
    CATEGORIES: "Categories",
    NEW_CATEGORY: "New Category",
  },
  // ... more organized alphabetically
} as const;
```

src/app/api/<feature>/…/route.ts

Calls service functions.

On error: uses getHttpStatus + getErrorMessage for consistent error handling.

All routes should use this pattern for proper HTTP status codes:
```typescript
try {
  const result = await serviceFunction(params);
  return NextResponse.json(result);
} catch (error) {
  return NextResponse.json(
    { error: getErrorMessage(error) }, 
    { status: getHttpStatus(error) }
  );
}
```

DELETE returns new Response(null, { status: 204 }) (no body).

Uses Web Response for bodyless statuses; NextResponse.json() for JSON bodies.

Pages under src/app/<feature>/…

List page (page.tsx): server component, fetches /api/<feature> with cache: "no-store".

New page (new/page.tsx): client form that POSTs JSON to the API.

Detail page ([idOrSlug]/page.tsx): server component showing one item.

Edit page ([idOrSlug]/edit/page.tsx): client form that PATCHes JSON (no-op tolerant, see below).

## Constants & Text Management

This project follows a comprehensive constants strategy for i18n readiness:

### Global Constants (`src/lib/constants/`)
- **api.ts**: API_URL and related constants
- **errors.ts**: Generic client-side error messages (CLIENT_ERROR_MESSAGES)
- **validation.ts**: Schema validation messages (VALIDATION_MESSAGES)

### Module Constants (`src/modules/<feature>/constants/`)
- **errors.ts**: Feature-specific error messages (<FEATURE>_ERRORS)
- **ui.ts**: Feature-specific UI text (<FEATURE>_UI)
- **index.ts**: Barrel exports for all constants

### Global UI Constants (`src/global/constants/`)
- **ui.ts**: Generic UI elements that appear across modules (GLOBAL_UI)

### Usage Patterns
```typescript
// Import constants
import { CATEGORIES_UI, CATEGORY_ERRORS } from "modules/categories";
import { GLOBAL_UI } from "global/constants";
import { VALIDATION_MESSAGES } from "lib/constants";

// Use in components
<h1>{CATEGORIES_UI.HEADERS.CATEGORIES}</h1>
<button>{GLOBAL_UI.BUTTONS.SAVE}</button>

// Schema validation
export const slugSchema = z
  .string()
  .min(3, VALIDATION_MESSAGES.SLUG_MIN_LENGTH);

// Error handling
throw new Error(CATEGORY_ERRORS.CATEGORY_NOT_FOUND_ERROR);
```

All constants use UPPERCASE naming and are organized alphabetically for consistency.

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

2) Zod schemas — src/modules/tags/schema.ts
import { z } from "zod";
import { VALIDATION_MESSAGES } from "lib/constants";

// IDs & slugs
const isCuid = (s: string) => z.cuid().safeParse(s).success;
export const idSchema = z.cuid();
export const slugSchema = z
  .string()
  .min(3, VALIDATION_MESSAGES.SLUG_MIN_LENGTH)
  .max(60, VALIDATION_MESSAGES.SLUG_MAX_LENGTH)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, VALIDATION_MESSAGES.SLUG_FORMAT)
  .refine((s) => !isCuid(s), VALIDATION_MESSAGES.SLUG_CUID_ERROR);
export const idOrSlugSchema = z.union([idSchema, slugSchema]);

// Inputs
const nameSchema = z.string().min(2, VALIDATION_MESSAGES.NAME_TOO_SHORT).max(80, VALIDATION_MESSAGES.NAME_TOO_LONG).trim();
export const descriptionSchema = z.string().max(500, VALIDATION_MESSAGES.DESCRIPTION_MAX_LENGTH).optional();

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
  { message: VALIDATION_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED }
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
import { prisma } from "@/lib/database/prisma";
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
import { NotFoundError, ConflictError } from "@/lib/http/errors";
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
import { getErrorMessage, getHttpStatus } from "@/lib/http/errors";

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
import { getErrorMessage, getHttpStatus } from "@/lib/http/errors";

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

5.5) Types — src/modules/tags/types.ts
import { z } from "zod";
import {
  tagPublicSchema,
  listTagsResponseSchema,
  listTagsQuerySchema,
} from "./schema";

// Export types inferred from Zod schemas
export type Tag = z.infer<typeof tagPublicSchema>;
export type ListTagsResponse = z.infer<typeof listTagsResponseSchema>;
export type ListTagsQuery = z.infer<typeof listTagsQuerySchema>;

5.6) Constants — src/modules/tags/constants/
Create src/modules/tags/constants/index.ts:
```typescript
export * from "./errors";
export * from "./ui";
```

Create src/modules/tags/constants/errors.ts:
```typescript
export const TAG_ERRORS = {
  CREATE_TAG_ERROR: "Failed to create tag",
  DELETE_TAG_ERROR: "Failed to delete tag",
  GET_TAGS_ERROR: "Failed to get tags",
  UPDATE_TAG_ERROR: "Failed to update tag",
  TAG_EXISTS_ERROR: "Tag with this slug already exists",
  TAG_NOT_FOUND_ERROR: "Tag not found",
  ERROR_LOADING_TAGS: "Error loading tags",
  ERROR_LOADING_TAG: "Error loading tag",
  VALIDATION_ERROR: "Validation error",
} as const;
```

Create src/modules/tags/constants/ui.ts:
```typescript
export const TAGS_UI = {
  HEADERS: {
    TAGS: "Tags",
    NEW_TAG: "New Tag",
  },
  LABELS: {
    NAME: "Name",
    SLUG: "Slug",
    DESCRIPTION: "Description",
  },
  PLACEHOLDERS: {
    NAME: "Enter the name of the tag",
    SLUG: "Enter the slug of the tag",
    DESCRIPTION: "Enter the tag description",
  },
  EMPTY_STATES: {
    NO_TAGS_FOUND: "No tags found",
    TAG_NOT_FOUND: "Tag not found",
  },
  LINKS: {
    CREATE_TAG: "Create Tag",
  },
} as const;
```

5.7) Hooks — src/modules/tags/hooks/
Create src/modules/tags/hooks/index.ts:
export * from "./useTagsList";
export * from "./useTag";
export * from "./useCreateTag";
export * from "./useUpdateTag";
export * from "./useDeleteTag";

Create all hook files following the categories module pattern:
- useTagsList.ts (similar to above)
- useTag.ts (single item fetch)
- useCreateTag.ts (create mutation)
- useUpdateTag.ts (update mutation) 
- useDeleteTag.ts (delete mutation)

Each hook should include proper error handling, TypeScript typing, and React Query integration.
See src/modules/categories/hooks/ for complete examples.

Update src/modules/tags/index.ts:
export * from "./schema";
export * from "./server/service";
export * from "./types";
export * from "./hooks";
export * from "./constants";

6) Pages (copy from categories and adjust)

/tags list, /tags/new, /tags/[idOrSlug], /tags/[idOrSlug]/edit