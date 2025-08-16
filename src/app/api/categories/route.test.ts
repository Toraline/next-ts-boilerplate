import { categoryRequiredData, categoryComplete } from "tests/fixtures/categories";
import { resetDb } from "tests/utils/reset-db";
import prisma from "infra/database";

describe("API Categories", () => {
  beforeEach(async () => {
    await resetDb();
  });

  describe("GET /api/categories", () => {
    test("should return empty array when no categories exist", async () => {
      const response = await fetch(process.env.API_URL + "/api/categories");
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({ items: [] });
    });

    test("should return all categories when any", async () => {
      // create a new category
      const categoryResponse = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryComplete),
      });
      const { createdAt, id, updatedAt } = await categoryResponse.json();

      // fetch all categories
      const response = await fetch(process.env.API_URL + "/api/categories");
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toEqual({ items: [{ ...categoryComplete, createdAt, id, updatedAt }] });
    });
  });

  describe("POST /api/categories", () => {
    test("should create a new category when all the data is passed", async () => {
      const response = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryComplete),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      const createdCategory = {
        ...categoryComplete,
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      const savedCategory = await prisma.category.findUnique({ where: { id: data.id } });

      expect(savedCategory).toEqual(createdCategory);
    });

    test("should create a new category when only required data is passed", async () => {
      const response = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryRequiredData),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      const createdCategory = {
        ...categoryRequiredData,
        description: "",
        id: data.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };

      const savedCategory = await prisma.category.findUnique({ where: { id: data.id } });

      expect(savedCategory).toEqual(createdCategory);
    });

    test("should return error when no slug is passed", async () => {
      const response = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Category without slug" }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();

      expect(data).toEqual({
        error: "Slug is required",
      });
    });

    test("should return error when no name is passed", async () => {
      const response = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: "category_without_name" }),
      });

      expect(response.status).toBe(400);

      const data = await response.json();

      expect(data).toEqual({
        error: "Name is required",
      });
    });
  });
});
