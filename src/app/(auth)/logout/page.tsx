"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { createAuthClient } from "lib/auth/client";
import { Button } from "global/ui";

const authClient = createAuthClient();

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  useEffect(() => {
    if (sessionQuery.data !== undefined && sessionQuery.data === null) {
      router.push("/login");
    }
  }, [sessionQuery.data, router]);

  async function handleLogout() {
    setIsSubmitting(true);
    setError(null);

    try {
      await authClient.signOut();
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to end session.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 px-6 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Logout Fake Provider</h1>
        <p className="text-base text-slate-600">
          Use this page to manually revoke the current session.
        </p>
      </header>

      <Button type="button" onClick={handleLogout} disabled={isSubmitting}>
        {isSubmitting ? "Ending..." : "Sign out"}
      </Button>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <nav className="grid gap-2 text-sm font-medium text-blue-600">
        <Link className="hover:underline" href="/login">
          Go to login
        </Link>
        <Link className="hover:underline" href="/api/auth/me" prefetch={false}>
          Check /api/auth/me (opens in new tab)
        </Link>
        <Link className="hover:underline" href="/">
          Back to home
        </Link>
      </nav>
    </main>
  );
}
