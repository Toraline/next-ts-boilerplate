import prisma from "lib/prisma";
import { Category, createCategorySchema } from "modules/categories";
import { categoryBySlug, categoryCreate } from "modules/categories/server/repo";

export async function createCategory(raw: unknown) {
  const category = createCategorySchema.parse(raw);

  const exists = await categoryBySlug(category.slug);
  console.log(exists);
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

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCategoryByIdOrSlug(idOrSlug: string) {
  const categoryById = await prisma.category.findUnique({
    where: { id: idOrSlug },
  });

  if (categoryById) {
    return categoryById;
  }

  const categoryBySlug = await prisma.category.findUnique({
    where: { slug: idOrSlug },
  });

  return categoryBySlug;
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
