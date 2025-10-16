import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import {
  getCategoryByIdOrSlug,
  updateCategoryByIdOrSlug,
  deleteCategoryByIdOrSlug,
} from "modules/categories";
import { errorMessages } from "constants/errors";
import { getErrorMessage, getHttpStatus } from "lib/errors";
export const runtime = "nodejs";

type RouteParams = { params: Promise<{ categoryIdOrSlug: string }> };

export async function GET(_r: Request, { params }: RouteParams) {
  try {
    const { categoryIdOrSlug } = await params;
    const category = await getCategoryByIdOrSlug(categoryIdOrSlug);

    return NextResponse.json(category);
  } catch (error) {
    console.error(errorMessages.GET_CATEGORIES_ERROR, error);
    return NextResponse.json({ error: errorMessages.GET_CATEGORIES_ERROR }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { categoryIdOrSlug } = await params;
    const json = await req.json();
    const updatedCategory = await updateCategoryByIdOrSlug(categoryIdOrSlug, json);
    return NextResponse.json(updatedCategory);
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) });
  }
}

export async function DELETE(_r: Request, { params }: RouteParams) {
  const { categoryIdOrSlug } = await params;

  try {
    const deletedCategory = await deleteCategoryByIdOrSlug(categoryIdOrSlug);

    if (!deletedCategory) {
      return NextResponse.json({ error: errorMessages.CATEGORY_NOT_FOUND_ERROR }, { status: 404 });
    }

    revalidatePath(`/categories/${categoryIdOrSlug}`);

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error(errorMessages.DELETE_CATEGORY_ERROR, error);
    return NextResponse.json({ error: errorMessages.DELETE_CATEGORY_ERROR }, { status: 500 });
  }
}
