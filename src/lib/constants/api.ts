/**
 * API-related constants
 *
 * For same-origin requests (browser to Next.js API routes), use relative URLs
 * to ensure cookies are sent properly. Only use absolute URLs when making
 * requests to external APIs.
 */
export const API_URL =
  typeof window !== "undefined"
    ? "/api" // Browser: use relative URL to ensure cookies are sent
    : (process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_VERCEL_URL ||
        "http://localhost:3000") + "/api"; // Server-side: can use absolute URL
