import prisma from "lib/prisma";
import {
  Category,
  categoryEntitySchema,
  categoryPublicSchema,
  listCategoriesResponseSchema,
  createCategorySchema,
  listCategoriesQuerySchema,
  idOrSlugSchema,
  isCuid,
} from "modules/categories";
import {
  categoryBySlug,
  categoryCreate,
  categoryFindMany,
  categoryById,
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
    throw new Error("Category not found");
  }

  return toPublic(foundCategoryByIdOrSlug);
}

export async function updateCategoryByIdOrSlug(idOrSlug: string, data: Partial<Category>) {
  const existingCategory = await getCategoryByIdOrSlug(idOrSlug);

  if (!existingCategory) return null;

  return prisma.category.update({
    where: { id: existingCategory.id },
    data: {
      name: data.name?.trim(),
      slug: data.slug?.trim(),
      description: data.description?.trim() ?? "",
    },
  });
}

export async function deleteCategoryByIdOrSlug(idOrSlug: string) {
  const existingCategory = await getCategoryByIdOrSlug(idOrSlug);

  if (!existingCategory) return null;

  return prisma.category.delete({
    where: { id: existingCategory.id },
  });
}
