import {
  categoryComplete,
  categoryRequiredData,
  missingNameError,
  missingSlugError,
  emptyNameError,
  emptySlugError,
} from "tests/fixtures/categories";
import prisma from "infra/database";
import { errorMessages } from "constants/errors";

describe("API Categories", () => {
  describe("GET /api/categories/:categoryIdOrSlug", () => {
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

    test("should return error when category do not exists", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`);
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data).toEqual({ error: errorMessages.CATEGORY_NOT_FOUND_ERROR });
    });
  });

  describe("PATCH /api/categories/:categoryIdOrSlug", () => {
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

    test("should update category when slug exists", async () => {
      // create a new category
      const categoryResponse = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryComplete),
      });
      const { slug } = await categoryResponse.json();

      // update category by slug
      const response = await fetch(process.env.API_URL + `/api/categories/${slug}`, {
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
      expect(data).toEqual({ error: errorMessages.NO_FIELDS_TO_UPDATE_ERROR });
    });

    test("should return error when name is not a string", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: 1,
        }),
      });
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toEqual(missingNameError);
    });

    test("should return error when empty name is passed", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
        }),
      });
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toEqual(emptyNameError);
    });

    test("should return error when slug is not a string", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: 1,
        }),
      });
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toEqual(missingSlugError);
    });

    test("should return error when empty slug is passed", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: "",
        }),
      });
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toEqual(emptySlugError);
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
      expect(data).toEqual({ error: errorMessages.CATEGORY_NOT_FOUND_ERROR });
    });

    test("should return error if updating slug to an existing one", async () => {
      await fetch(process.env.API_URL + `/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryComplete),
      });

      const categoryResponse = await fetch(process.env.API_URL + `/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryRequiredData),
      });

      const { id } = await categoryResponse.json();

      const response = await fetch(process.env.API_URL + `/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: categoryComplete.slug }),
      });

      expect(response.status).toBe(409);
    });
  });

  describe("DELETE /api/categories/:categoryIdOrSlug", () => {
    test("should delete category when id exists", async () => {
      const categoryResponse = await fetch(process.env.API_URL + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryComplete),
      });
      const { id } = await categoryResponse.json();

      const response = await fetch(process.env.API_URL + `/api/categories/${id}`, {
        method: "DELETE",
      });
      expect(response.status).toBe(200);

      const savedCategory = await prisma.category.findUnique({ where: { id } });

      expect(savedCategory).toBeNull();
    });

    test("should return error when category do not exists", async () => {
      const response = await fetch(process.env.API_URL + `/api/categories/non-existing-category`, {
        method: "DELETE",
      });
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data).toEqual({ error: errorMessages.CATEGORY_NOT_FOUND_ERROR });
    });
  });
});
