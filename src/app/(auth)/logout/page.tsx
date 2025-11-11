"use client";

import { useState } from "react";
import Link from "next/link";
import { createAuthClient } from "lib/auth/client";
import { Button } from "global/ui";

const authClient = createAuthClient();

export default function LogoutPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await authClient.signOut();
      setMessage("Sessão revogada. O cookie s_session foi limpo.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Não foi possível encerrar a sessão.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 px-6 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Logout Fake Provider</h1>
        <p className="text-base text-slate-600">
          Utilize esta página para revogar manualmente a sessão atual.
        </p>
      </header>

      <Button type="button" onClick={handleLogout} disabled={isSubmitting}>
        {isSubmitting ? "Encerrando..." : "Encerrar sessão"}
      </Button>

      {message && (
        <p className="text-sm text-emerald-600" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <nav className="grid gap-2 text-sm font-medium text-blue-600">
        <Link className="hover:underline" href="/login">
          Ir para login
        </Link>
        <Link className="hover:underline" href="/api/auth/me" prefetch={false}>
          Verificar /api/auth/me (abre em nova aba)
        </Link>
        <Link className="hover:underline" href="/">
          Voltar para a home
        </Link>
      </nav>
    </main>
  );
}
