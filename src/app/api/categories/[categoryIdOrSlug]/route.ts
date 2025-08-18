import * as z from "zod";
import { NextResponse } from "next/server";

import {
  CategorySchema,
  getCategoryByIdOrSlug,
  updateCategoryByIdOrSlug,
  deleteCategoryByIdOrSlug,
} from "modules/categories";
export const runtime = "nodejs";

type RouteParams = { params: Promise<{ categoryIdOrSlug: string }> };

export async function GET(_r: Request, { params }: RouteParams) {
  const { categoryIdOrSlug } = await params;

  try {
    const category = await getCategoryByIdOrSlug(categoryIdOrSlug);

    if (category) {
      return NextResponse.json(category);
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
    const body = await request.json();
    const parsed = CategorySchema.partial().safeParse(body);

    if (!parsed.success) {
      const errorsTree = z.treeifyError(parsed.error);
      const issues = errorsTree.properties;
      return NextResponse.json({ error: "Validation error", issues }, { status: 400 });
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updatedCategory = await updateCategoryByIdOrSlug(categoryIdOrSlug, parsed.data);

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

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

export async function DELETE(_r: Request, { params }: RouteParams) {
  const { categoryIdOrSlug } = await params;

  try {
    const deletedCategory = await deleteCategoryByIdOrSlug(categoryIdOrSlug);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
