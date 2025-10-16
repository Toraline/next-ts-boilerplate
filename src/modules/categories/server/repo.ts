import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import { listCategoriesQuerySchema } from "../schema";

export const categoryById = (id: string) => prisma.category.findUnique({ where: { id } });

export const categoryBySlug = (slug: string) => prisma.category.findUnique({ where: { slug } });

export const categoryCreate = (data: { slug: string; name: string; description?: string }) =>
  prisma.category.create({ data });

export async function categoryFindMany(raw: unknown) {
  const { page, pageSize, search, sortBy, sortDir } = listCategoriesQuerySchema.parse(raw);

  const where: Prisma.CategoryWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

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
