import { NextResponse } from "next/server";
import { createCategory, listCategories } from "modules/categories";
import { getErrorMessage, getHttpStatus } from "lib/errors";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());

    const data = await listCategories(params);

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: getHttpStatus(e) });
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
