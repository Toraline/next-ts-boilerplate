import { test, expect } from "@playwright/test";

test.describe("GET /api/status", () => {
  test("should return status ok", async ({ request }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const response = await request.get(`${apiUrl}/api/status`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    const expectedStatus = {
      dependencies: {
        database: {
          server_version: "16.10 (Debian 16.10-1.pgdg13+1)",
          max_connections: 100,
        },
      },
    };

    expect(data).toEqual(expectedStatus);
  });
});
