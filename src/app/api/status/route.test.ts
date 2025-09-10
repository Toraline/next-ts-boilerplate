describe("GET /api/status", () => {
  test("should return status ok", async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/status");
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();
    const expectedStatus = {
      dependencies: {
        database: {
          server_version: "16.9 (Debian 16.9-1.pgdg120+1)",
          max_connections: 100,
        },
      },
    };
    expect(data).toEqual(expectedStatus);
  });
});
