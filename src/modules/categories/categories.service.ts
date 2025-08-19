import prisma from "infra/database";
import { Category } from "modules/categories";

export async function createCategory(category: Category) {
  return prisma.category.create({
    data: {
      name: category.name.trim(),
      slug: category.slug.trim(),
      description: category.description?.trim() ?? "",
    },
  });
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
