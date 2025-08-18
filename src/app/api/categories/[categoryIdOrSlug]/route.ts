import { NextResponse } from "next/server";
import prisma from "infra/database";
import { Category } from "schemas/category";
export const runtime = "nodejs";

type RouteParams = { params: Promise<{ categoryIdOrSlug: string }> };

export async function GET(_r: Request, { params }: RouteParams) {
  const { categoryIdOrSlug } = await params;

  try {
    const categoryById = await prisma.category.findUnique({
      where: { id: categoryIdOrSlug },
    });

    if (categoryById) {
      return NextResponse.json(categoryById);
    }

    const categoryBySlug = await prisma.category.findUnique({
      where: { slug: categoryIdOrSlug },
    });

    if (categoryBySlug) {
      return NextResponse.json(categoryBySlug);
    }

    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { categoryIdOrSlug } = await params;

  try {
    const { name, slug, description } = await request.json();
    const data: Partial<Category> = {};
    if (name) data.name = name;
    if (slug) data.slug = slug;
    if (description) data.description = description;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const savedCategory = await prisma.category.findUnique({
      where: { id: categoryIdOrSlug },
    });

    if (!savedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryIdOrSlug },
      data,
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 409 },
      );
    }

    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { categoryIdOrSlug } = await params;

  try {
    const savedCategory = await prisma.category.findUnique({
      where: { id: categoryIdOrSlug },
    });

    if (!savedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const deletedCategory = await prisma.category.delete({
      where: { id: categoryIdOrSlug },
    });

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
