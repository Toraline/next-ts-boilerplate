import { loginRequestSchema } from "./schemas";

describe("auth schemas", () => {
  describe("loginRequestSchema", () => {
    it("accepts payload with email only", () => {
      const result = loginRequestSchema.parse({ email: "user@example.com" });
      expect(result).toEqual({ email: "user@example.com" });
    });

    it("accepts payload with userId only", () => {
      const userId = "cku8l1y4y000001mn0example";
      const result = loginRequestSchema.parse({ userId });
      expect(result).toEqual({ userId });
    });

    it("rejects payload without identity", () => {
      expect(() => loginRequestSchema.parse({})).toThrow();
    });

    it("rejects payload with both email and userId", () => {
      expect(() => loginRequestSchema.parse({ email: "user@example.com", userId: "cku8l1y4y000001mn0example" })).toThrow();
    });
  });
});

