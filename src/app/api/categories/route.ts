import { categories as initialCategories } from "tests/fixtures/categories";

export async function GET() {
  return Response.json(initialCategories);
}

export async function POST(request: Request) {
  const newCategory = await request.json();

  return Response.json(newCategory, { status: 201 });
}
