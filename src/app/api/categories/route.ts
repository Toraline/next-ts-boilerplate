import { NextResponse } from "next/server";
import { createCategory, listCategories } from "modules/categories";
import { errorMessages } from "constants/errors";
import { getErrorMessage, getHttpStatus } from "lib/errors";

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

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const created = await createCategory(json);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) });
  }
}
