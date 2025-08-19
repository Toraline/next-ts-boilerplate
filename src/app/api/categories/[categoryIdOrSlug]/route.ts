import * as z from "zod";
import { NextResponse } from "next/server";

import {
  CategorySchema,
  getCategoryByIdOrSlug,
  updateCategoryByIdOrSlug,
  deleteCategoryByIdOrSlug,
} from "modules/categories";
import { errorMessages } from "constants/errors";
export const runtime = "nodejs";

type RouteParams = { params: Promise<{ categoryIdOrSlug: string }> };

export async function GET(_r: Request, { params }: RouteParams) {
  const { categoryIdOrSlug } = await params;

  try {
    const category = await getCategoryByIdOrSlug(categoryIdOrSlug);

    if (category) {
      return NextResponse.json(category);
    }

    return NextResponse.json({ error: errorMessages.CATEGORY_NOT_FOUND_ERROR }, { status: 404 });
  } catch (error) {
    console.error(errorMessages.GET_CATEGORIES_ERROR, error);
    return NextResponse.json({ error: errorMessages.GET_CATEGORIES_ERROR }, { status: 500 });
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
      return NextResponse.json({ error: errorMessages.VALIDATION_ERROR, issues }, { status: 400 });
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: errorMessages.NO_FIELDS_TO_UPDATE_ERROR }, { status: 400 });
    }

    const updatedCategory = await updateCategoryByIdOrSlug(categoryIdOrSlug, parsed.data);

    if (!updatedCategory) {
      return NextResponse.json({ error: errorMessages.CATEGORY_NOT_FOUND_ERROR }, { status: 404 });
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: errorMessages.CATEGORY_EXISTS_ERROR }, { status: 409 });
    }

    console.error(errorMessages.UPDATE_CATEGORY_ERROR, error);
    return NextResponse.json({ error: errorMessages.UPDATE_CATEGORY_ERROR }, { status: 500 });
  }
}

export async function DELETE(_r: Request, { params }: RouteParams) {
  const { categoryIdOrSlug } = await params;

  try {
    const deletedCategory = await deleteCategoryByIdOrSlug(categoryIdOrSlug);

    if (!deletedCategory) {
      return NextResponse.json({ error: errorMessages.CATEGORY_NOT_FOUND_ERROR }, { status: 404 });
    }

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error(errorMessages.DELETE_CATEGORY_ERROR, error);
    return NextResponse.json({ error: errorMessages.DELETE_CATEGORY_ERROR }, { status: 500 });
  }
}
