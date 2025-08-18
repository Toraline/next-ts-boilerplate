import * as z from "zod";
import { NextResponse } from "next/server";

import { CategorySchema, createCategory, listCategories } from "modules/categories";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await listCategories();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CategorySchema.safeParse(body);

    if (!parsed.success) {
      const errorsTree = z.treeifyError(parsed.error);
      const issues = errorsTree.properties;
      return NextResponse.json({ error: "Validation error", issues }, { status: 400 });
    }

    const created = await createCategory(parsed.data);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 409 },
      );
    }

    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
