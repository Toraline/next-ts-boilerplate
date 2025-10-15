import prisma from "lib/prisma";

export const categoryBySlug = (slug: string) => prisma.category.findUnique({ where: { slug } });

export const categoryCreate = (data: { slug: string; name: string; description?: string }) =>
  prisma.category.create({ data });
