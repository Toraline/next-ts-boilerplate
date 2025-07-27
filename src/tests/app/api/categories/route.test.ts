import { categories, category1 } from "../../../fixtures/categories";

describe("GET /api/categories", () => {
  test("should return all categories", async () => {
    const response = await fetch(process.env.API_URL + "/api/categories");

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual(categories);
  });

  test("POST /api/categories", async () => {
    const response = await fetch(process.env.API_URL + "/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category1),
    });

    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data).toEqual(category1);
  });
});
