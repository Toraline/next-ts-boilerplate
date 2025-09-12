import * as z from "zod";
import { NextResponse } from "next/server";

import { CategorySchema, createCategory, listCategories } from "modules/categories";
import { errorMessages } from "constants/errors";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await listCategories();

    return NextResponse.json({ items });
  } catch (error) {
    console.error(errorMessages.GET_CATEGORIES_ERROR, error);
    return NextResponse.json({ error: errorMessages.GET_CATEGORIES_ERROR }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CategorySchema.safeParse(body);

    if (!parsed.success) {
      const errorsTree = z.treeifyError(parsed.error);
      const issues = errorsTree.properties;
      return NextResponse.json({ error: errorMessages.VALIDATION_ERROR, issues }, { status: 400 });
    }

    const created = await createCategory(parsed.data);

    revalidatePath("/categories");

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: errorMessages.CATEGORY_EXISTS_ERROR }, { status: 409 });
    }

    console.error(errorMessages.CREATE_CATEGORY_ERROR, error);
    return NextResponse.json({ error: errorMessages.CREATE_CATEGORY_ERROR }, { status: 500 });
  }
}
