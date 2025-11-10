import { TooManyRequestsError } from "lib/http/errors";

type RateLimitEntry = {
  windowStartedAt: number;
  count: number;
};

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;

const globalStore = globalThis as unknown as {
  __fakeAuthRateLimitStore?: Map<string, RateLimitEntry>;
};

const store: Map<string, RateLimitEntry> =
  globalStore.__fakeAuthRateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalStore.__fakeAuthRateLimitStore) {
  globalStore.__fakeAuthRateLimitStore = store;
}

export function trackLoginAttempt(ip: string) {
  const key = ip || "unknown";
  const now = Date.now();

  const existing = store.get(key);
  if (!existing) {
    store.set(key, { count: 1, windowStartedAt: now });
    return;
  }

  const elapsed = now - existing.windowStartedAt;
  if (elapsed > WINDOW_MS) {
    store.set(key, { count: 1, windowStartedAt: now });
    return;
  }

  if (existing.count >= MAX_ATTEMPTS) {
    throw new TooManyRequestsError("Too many login attempts. Please try again later.");
  }

  existing.count += 1;
  store.set(key, existing);
}

export function getRateLimitSnapshot(ip: string) {
  return store.get(ip || "unknown");
}
