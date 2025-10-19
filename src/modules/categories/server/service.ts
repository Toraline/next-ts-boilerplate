import { NotFoundError } from "lib/errors";
import {
  categoryEntitySchema,
  categoryPublicSchema,
  listCategoriesResponseSchema,
  createCategorySchema,
  listCategoriesQuerySchema,
  idOrSlugSchema,
  isCuid,
  idSchema,
  updateCategorySchema,
} from "modules/categories";
import {
  categoryBySlug,
  categoryCreate,
  categoryFindMany,
  categoryById,
  categoryUpdate,
  categoryDelete,
} from "modules/categories/server/repo";

export async function createCategory(raw: unknown) {
  const category = createCategorySchema.parse(raw);

  const exists = await categoryBySlug(category.slug);

  if (exists) {
    throw new Error("Category with this slug already exists");
  }

  const created = await categoryCreate({
    slug: category.slug,
    name: category.name.trim(),
    description: typeof category.description === "string" ? category.description.trim() : "",
  });

  return created;
}

function toPublic(row: unknown) {
  const entity = categoryEntitySchema.parse(row);

  return categoryPublicSchema.parse({
    ...entity,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  });
}

export async function listCategories(rawQuery: unknown) {
  const query = listCategoriesQuerySchema.parse(rawQuery);

  const response = await categoryFindMany(query);

  const categories = response.items.map(toPublic);

  return listCategoriesResponseSchema.parse({ ...response, items: categories });
}

export async function getCategoryByIdOrSlug(raw: unknown) {
  const idOrSlug = idOrSlugSchema.parse(raw);
  const cuid = isCuid(idOrSlug);

  const foundCategoryByIdOrSlug = cuid
    ? await categoryById(idOrSlug)
    : await categoryBySlug(idOrSlug);

  if (!foundCategoryByIdOrSlug) {
    throw new NotFoundError();
  }

  return toPublic(foundCategoryByIdOrSlug);
}

export async function updateCategoryByIdOrSlug(idOrSlug: string, raw: unknown) {
  const isId = idSchema.safeParse(idOrSlug).success;
  const existingCategory = isId ? await categoryById(idOrSlug) : await categoryBySlug(idOrSlug);

  if (!existingCategory) throw new NotFoundError();

  const patch = updateCategorySchema.parse(raw);

  if (typeof patch.slug !== "undefined" && patch.slug !== existingCategory.slug) {
    const exists = await categoryBySlug(patch.slug);

    if (exists) {
      throw new Error("Category with this slug already exists");
    }
  }

  const prismaPatch: Record<string, unknown> = {};

  if (typeof patch.name !== "undefined") {
    prismaPatch.name = patch.name.trim();
  }

  if (typeof patch.slug !== "undefined") {
    prismaPatch.slug = patch.slug.trim();
  }

  if (typeof patch.description !== "undefined") {
    prismaPatch.description = patch.description.trim();
  }

  const updatedCategory = await categoryUpdate(existingCategory.id, prismaPatch);

  return toPublic(updatedCategory);
}

export async function deleteCategoryByIdOrSlug(idOrSlug: string) {
  const isId = idSchema.safeParse(idOrSlug).success;
  const existingCategory = isId ? await categoryById(idOrSlug) : await categoryBySlug(idOrSlug);

  if (!existingCategory) throw new NotFoundError();

  await categoryDelete(existingCategory.id);

  return;
}
