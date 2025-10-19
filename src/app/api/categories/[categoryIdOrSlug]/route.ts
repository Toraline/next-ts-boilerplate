import { NextResponse } from "next/server";

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
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
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
  try {
    const { categoryIdOrSlug } = await params;
    await deleteCategoryByIdOrSlug(categoryIdOrSlug);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: getHttpStatus(error) });
  }
}
