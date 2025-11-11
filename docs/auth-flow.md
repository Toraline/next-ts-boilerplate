# Fake Auth Provider Overview

The authentication layer now relies on an `AuthProvider` abstraction so that the backend and frontend consume a unified contract regardless of the underlying identity service.

## Provider interface (server)

- Source: `src/server/auth/provider.ts`.
- Contract methods: `signIn`, `signOut`, `signUp`, `getSession`, `getUser`, `isEmailVerified`.
- `getAuthProvider()` resolves the implementation based on the `AUTH_PROVIDER` environment variable (default: `FAKE`).
- The fake provider lives at `src/server/auth/providers/fakeProvider.ts` and reuses the existing session storage, audit logging, and rate limiting.

## Frontend client

- Source: `src/lib/auth/client.ts`.
- Exposes matching operations to the browser (`signIn`, `signOut`, `getSession`, `getUser`, `isEmailVerified`).
- Minimal UX pages are available under:
  - `src/app/(auth)/login/page.tsx`
  - `src/app/(auth)/logout/page.tsx`
- These pages rely on the client to exercise the fake provider manually (create/read/clear the `s_session` cookie).

## Environment configuration

- Add `AUTH_PROVIDER=FAKE` to your `.env` (see `.env.example`).
- Switching providers only requires changing this variable (future providers will plug into the same contract).

## Manual verification

- API: follow `docs/manual-auth-testing.md` for curl/HTTPie recipes.
- Frontend: use the login/logout pages described above to authenticate and inspect the issued cookies/headers.

---

# Fake Auth Manual QA Guide

This guide describes how to validate the fake authentication API manually until automated end-to-end coverage is available.

## Prerequisites
- Ensure PostgreSQL is running (`npm run services:up` if using the provided docker compose).
- Apply the latest Prisma migration: `npx prisma migrate dev`.
- Seed or create at least one active user so that login can succeed.

## A1 — Session Model & Repository
1. Launch Prisma Studio (`npx prisma studio`) or connect with your preferred SQL client.
2. Confirm the `Session` table exists with the columns:
   - `id`, `userId`, `createdAt`, `revokedAt`, `expiresAt`, `userAgent`, `ipHash`.
3. Manually insert a session row tied to a known user (via Prisma Studio or SQL) with `expiresAt` in the future and `revokedAt = null`.
4. Verify lifecycle behaviours through the API:
   - Logging in (A2) should create a new session row.
   - Manually set `revokedAt` on that session and re-run `/api/auth/me` to confirm it now returns `401`.

## A2 — POST /api/auth/login
1. Using Thunder Client, Hoppscotch, or curl, send `POST http://localhost:3000/api/auth/login` with JSON `{ "email": "<user@example.com>" }`.
2. Expect `200` with body `{ user, sessionId }`. Capture the `Set-Cookie` header (`s_session`).
3. Inspect the `Session` table – a new row should exist with `revokedAt = null` and `expiresAt` ~24h in the future.
4. Check server logs or query `AuditLog` for an entry with `action = auth.session.created`, `targetId = sessionId`, and `actorType = USER`.
5. Negative checks:
   - Non-existent user → `404`.
   - Soft-deleted user (`deletedAt` not null) → `404`.
   - Eleven rapid requests (same IP) → `429`. Use a REST client runner or script to send 11 requests within a minute.
6. Multi-session sanity:
   - Repeat the login from another device/browser and confirm a new session row is created with its own cookie.

## A3 — POST /api/auth/logout
1. Reuse the `s_session` cookie from login. Call `POST /api/auth/logout` with the cookie attached.
2. Expect `204` plus a `Set-Cookie` header that clears `s_session`.
3. Confirm the session row now has `revokedAt` populated.
4. Repeating logout with the same cookie still returns `204`. Audit log should show `actorType = ANONYMOUS` on the second call.

## A4 — GET /api/auth/me
1. While logged in, call `GET /api/auth/me` with the active `s_session` cookie.
2. Expect `200` with `{ user }`, and response headers `x-actor-type: USER`, `x-actor-user-id: <userId>`.
3. After logout (or manually set the session `expiresAt` to a past time), the same request should return `401`.

## A5 — Middleware (`withActorFromSession`)
1. Example usage: temporarily wrap an existing mutation route (e.g. categories `POST`) with `withActorFromSession`.
2. Confirm requests with a valid session automatically receive `x-actor-*` headers and proceed.
3. Make the same request without a cookie; expect `401` unless `allowAnonymous` is enabled.
4. For QA, a sample mutation test harness can reuse the logout endpoint (already wrapped) to observe:
   - No cookie → response headers show `x-actor-type: ANONYMOUS`.
   - Invalid `x-actor-user-id` header combined with a cookie from another user → `403`.

## A6 — Schema Validation
1. Login payload with both `email` and `userId` or with neither should return `400`.
2. Invalid email format should trigger a validation error (also `400`).
3. Review handler responses to ensure they conform to `loginResponseSchema` and `meResponseSchema` (no missing fields, ISO date strings).

## Audit & Rate Limit Observability
- Query the audit logs: `SELECT action, actor_type, target_id, metadata FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 20;`.
- Rate limiter state is in-memory. To confirm reset behaviour, wait one minute and retry logins—should succeed after cooldown.

## Future E2E Automation Checklist
Documented scenarios for Playwright (not yet automated):
1. Login happy path → assert cookie and `/me` success.
2. Login → logout → `/me` returning 401.
3. Rate limit hit after 10 attempts.
4. Revoked session rejecting protected mutation (when middleware applied).

