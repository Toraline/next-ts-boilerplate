import { test, expect } from "@playwright/test";

test.describe("GET /api/status", () => {
  test("should return status ok", async ({ request }) => {
    const apiUrl = "http://localhost:3000";

    const response = await request.get(`${apiUrl}/api/status`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();

    // Definição flexível do que esperamos receber
    const expectedStatus = {
      dependencies: {
        database: {
          // Verifica se contém "16", mas ignora o resto do texto
          server_version: expect.stringContaining("16"),
          // Aceita qualquer número, pois a config de conexões pode mudar
          max_connections: expect.any(Number),
        },
      },
    };

    // Usamos toMatchObject para que o teste não quebre se você adicionar no futuro.
    expect(data).toMatchObject(expectedStatus);
  });
});
