import { NextResponse } from "next/server";
import prisma from "infra/database";

export const runtime = "nodejs";

export async function GET() {
  return Response.json("initialCategories");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const created = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || "",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
