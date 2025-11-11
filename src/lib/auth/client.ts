"use client";

import { z } from "zod";
import { loginRequestSchema, loginResponseSchema, meResponseSchema } from "server/auth/schemas";

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;

export type AuthClient = {
  signIn(input: LoginRequest): Promise<LoginResponse>;
  signOut(): Promise<void>;
  signUp(input: unknown): Promise<never>;
  getSession(): Promise<MeResponse | null>;
  getUser(): Promise<MeResponse["user"] | null>;
  isEmailVerified(): Promise<boolean>;
};

type FetcherOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
};

function describeError(response: Response, payload: unknown) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const { error } = payload as { error?: unknown };
    if (typeof error === "string") {
      return error;
    }
  }

  return `Request failed with status ${response.status}`;
}

async function requestJson<T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  options: FetcherOptions = {},
): Promise<z.infer<T>> {
  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  const raw = await response.json().catch<unknown>(() => null);

  if (!response.ok) {
    throw new Error(describeError(response, raw));
  }

  return schema.parse(raw);
}

async function requestVoid(path: string, options: FetcherOptions = {}) {
  const response = await fetch(path, {
    method: options.method ?? "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  if (!response.ok) {
    const raw = await response.json().catch<unknown>(() => null);
    throw new Error(describeError(response, raw));
  }
}

export function createAuthClient(basePath = "/api/auth"): AuthClient {
  const loginUrl = `${basePath}/login`;
  const logoutUrl = `${basePath}/logout`;
  const meUrl = `${basePath}/me`;

  return {
    async signIn(input) {
      const payload = loginRequestSchema.parse(input);
      return requestJson(loginUrl, loginResponseSchema, { method: "POST", body: payload });
    },
    async signOut() {
      await requestVoid(logoutUrl, { method: "POST" });
    },
    async signUp() {
      throw new Error("signUp is not implemented for the fake auth provider");
    },
    async getSession() {
      try {
        return await requestJson(meUrl, meResponseSchema, { method: "GET" });
      } catch (error) {
        if (error instanceof Error && /status 401/.test(error.message)) {
          return null;
        }
        throw error;
      }
    },
    async getUser() {
      const session = await this.getSession();
      return session?.user ?? null;
    },
    async isEmailVerified() {
      return true;
    },
  };
}
