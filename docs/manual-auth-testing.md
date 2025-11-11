# Manual Auth Testing (Fake Provider)

This checklist provides a repeatable way to exercise the fake auth provider end-to-end without automated tests.

## Prerequisites

- Application running locally on `http://localhost:3000`.
- Database seeded with at least one active user (e.g. `n` → create user).
- Browser devtools open to inspect cookies and response headers.

> All requests below target the default Next.js dev server. Adjust the base URL if you are running behind a proxy.

## 1. Sign in via API (curl)

```bash
curl -i \
  -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@example.com" }'
```

Expectations:
- `200 OK` response with JSON body `{ "user": { ... }, "sessionId": "<cuid>" }`.
- `Set-Cookie: s_session=<sessionId>; HttpOnly; Secure?; SameSite=Lax`.
- A new row in the `Session` table with `revokedAt = null`.
- Audit log entry `auth.session.created`.

Negative checks:
- Unknown email → `404`.
- More than 10 attempts/minute from the same IP → `429`.

Multi-device check:
- Repeat the login from another browser/profile (or a mobile client). You should receive a fresh `sessionId`, a distinct `s_session` cookie, and a second row in the `Session` table.

## 2. Session introspection

```bash
curl -i \
  -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: s_session=<sessionId from step 1>"
```

Expectations:
- `200 OK` with `{ "user": ... }`.
- Response headers include `x-actor-type: USER` and `x-actor-user-id`.

Without the cookie or with a revoked session → `401`.

## 3. Sign out via API

```bash
curl -i \
  -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: s_session=<sessionId from step 1>"
```

Expectations:
- `204 No Content`.
- `Set-Cookie: s_session=; Max-Age=0`.
- Session record now has `revokedAt` populated.
- Audit log entry `auth.session.revoked` using the current actor (`USER` on first logout, `ANONYMOUS` on subsequent calls).

Calling logout again with the same cookie should still return `204` and leave the audit trail.

## 4. Middleware sanity check

Use any mutation route already wrapped with `withActorFromSession` (e.g. `/api/auth/logout`):
- With valid cookie → request succeeds and retains `x-actor-*` headers.
- Without cookie and no anonymous allowance → `401`.

## 5. Frontend walkthrough

1. Visit `http://localhost:3000/login`.
   - Provide either an email or userId (not both).
   - Submit and confirm the success message shows the session ID.
   - Inspect cookies to confirm `s_session` exists.
   - Follow the `/api/auth/me` link to observe the authenticated response.
2. Navigate to `http://localhost:3000/logout`.
   - Click “Encerrar sessão”.
   - Confirm the success message and check that `s_session` is cleared in the browser.
   - Visit `/api/auth/me` again to verify it now returns `401`.
   - Return to the first device/browser and confirm `s_session` there still works until you log out separately.

## 6. Optional: Postman/Hoppscotch

- Create a collection with:
  - `POST /api/auth/login` (JSON body `{ "email": "<email>" }`).
  - `GET /api/auth/me`.
  - `POST /api/auth/logout`.
- Enable cookie persistence so the `s_session` cookie flows between requests.

## Troubleshooting

- **Missing user**: Ensure the email/userId exists and `deletedAt` is null.
- **429 Too Many Requests**: Wait one minute (rate limiter reset) or change the fake source IP.
- **Cookie not set**: Verify you are on HTTPS in production (cookies marked `Secure`); in dev, `http://localhost` works out of the box.

