import { categoryComplete } from "tests/fixtures/categories";
import prisma from "infra/database";

describe("API Categories", () => {
  describe("GET /api/categories/:categoryId", () => {
    test("should return category details when id exists", async () => {
      // create a new category
      const categoryResponse = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryComplete),
      });
      const { createdAt, id, updatedAt } = await categoryResponse.json();

      // fetch category by ID
      const response = await fetch(process.env.API_URL + `/api/categories/${id}`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({ ...categoryComplete, createdAt, id, updatedAt });
    });

    test("should return category details when slug exists", async () => {
      // create a new category
      const categoryResponse = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryComplete),
      });
      const { createdAt, id, updatedAt } = await categoryResponse.json();

      // fetch category by ID
      const response = await fetch(
        process.env.API_URL + `/api/categories/${categoryComplete.slug}`,
      );
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({ ...categoryComplete, createdAt, id, updatedAt });
    });

    test("should return error when category do not exists", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`);
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data).toEqual({ error: "Category not found" });
    });
  });

  describe("PATCH /api/categories/:categoryId", () => {
    test("should update category when id exists", async () => {
      // create a new category
      const categoryResponse = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryComplete),
      });
      const { id } = await categoryResponse.json();

      // update category by ID
      const response = await fetch(process.env.API_URL + `/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Updated Category" }),
      });
      expect(response.status).toBe(200);

      const data = await response.json();
      const savedCategory = await prisma.category.findUnique({ where: { id: data.id } });

      expect({
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      }).toEqual(savedCategory);
    });

    test("should return error when no data is passed", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toEqual({ error: "No fields to update" });
    });

    test("should return error when category do not exists", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Updated Category" }),
      });
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data).toEqual({ error: "Category not found" });
    });
  });
});
