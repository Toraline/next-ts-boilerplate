import { Prisma } from "@prisma/client";
import prisma from "lib/database/prisma";
import { listCategoriesQuerySchema } from "../schema";

export const categoryById = (id: string, userId?: string) => {
  const where: { id: string; userId?: string } = { id };
  if (userId) where.userId = userId;
  return prisma.category.findUnique({ where });
};

export const categoryBySlug = (slug: string, userId?: string) => {
  const where: { slug: string; userId?: string } = { slug };
  if (userId) where.userId = userId;
  return prisma.category.findUnique({ where });
};

export const categoryCreate = (data: {
  slug: string;
  name: string;
  description?: string;
  userId: string;
}) => prisma.category.create({ data });

export async function categoryFindMany(raw: unknown, userId: string) {
  const { page, pageSize, search, sortBy, sortDir } = listCategoriesQuerySchema.parse(raw);

  const searchConditions: Prisma.CategoryWhereInput[] = search
    ? [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    : [];

  const where: Prisma.CategoryWhereInput = {
    userId,
    ...(searchConditions.length > 0 ? { OR: searchConditions } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
    }),
    prisma.category.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export const categoryUpdate = (id: string, data: Prisma.CategoryUpdateInput) =>
  prisma.category.update({ where: { id }, data });

export const categoryDelete = (id: string) => prisma.category.delete({ where: { id } });
