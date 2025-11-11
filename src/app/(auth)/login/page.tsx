"use client";

import { useMemo } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAuthClient, type LoginRequest, type LoginResponse } from "lib/auth/client";
import { loginRequestSchema } from "server/auth/schemas";
import { Field } from "global/ui/Field/Field";
import { Button } from "global/ui";
import { useMutation } from "global/hooks/useMutation";
import type { ApiError } from "lib/client/errors";

const authClient = createAuthClient();

type LoginFormValues = z.infer<typeof loginRequestSchema>;

const DEFAULT_VALUES: LoginFormValues = {
  email: undefined,
  userId: undefined,
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const signInMutation = useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: async (payload) => authClient.signIn(payload),
  });

  const [emailValue, userIdValue] = watch(["email", "userId"]);

  const payloadPreview = useMemo(() => {
    const trimmedEmail = emailValue?.trim() ?? "";
    const trimmedUserId = userIdValue?.trim() ?? "";
    const payload: Partial<LoginRequest> = {};
    if (trimmedEmail) payload.email = trimmedEmail;
    if (trimmedUserId) payload.userId = trimmedUserId;
    return Object.keys(payload).length > 0 ? JSON.stringify(payload, null, 2) : null;
  }, [emailValue, userIdValue]);

  const onSubmit = (values: LoginFormValues) => {
    const payload: LoginRequest = {
      ...(values.email?.trim() ? { email: values.email.trim() } : {}),
      ...(values.userId?.trim() ? { userId: values.userId.trim() } : {}),
    };

    signInMutation.mutate(payload);
  };

  const isLoading = isSubmitting || signInMutation.isPending;
  const globalError = errors.root?.message;
  const apiError = signInMutation.error?.message;
  const successUser = signInMutation.data?.user;
  const successSession = signInMutation.data?.sessionId;

  return (
    <main className="mx-auto max-w-xl space-y-6 px-6 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Login Fake Provider</h1>
        <p className="text-base text-slate-600">
          Utilize <strong>apenas um</strong> dos campos abaixo. Cada login cria uma sessão
          independente e define o cookie <code className="font-mono text-sm">s_session</code>.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <Field
          label="Email"
          id="login-email"
          type="email"
          placeholder="user@example.com"
          aria-label="Email"
          error={errors.email?.message}
          {...register("email", {
            setValueAs: (value) => {
              if (typeof value !== "string") return undefined;
              const trimmed = value.trim();
              return trimmed.length ? trimmed : undefined;
            },
          })}
        />

        <div className="text-center text-sm text-slate-500">ou</div>

        <Field
          label="User ID"
          id="login-user-id"
          type="text"
          placeholder="cuid..."
          aria-label="User ID"
          error={errors.userId?.message}
          {...register("userId", {
            setValueAs: (value) => {
              if (typeof value !== "string") return undefined;
              const trimmed = value.trim();
              return trimmed.length ? trimmed : undefined;
            },
          })}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      {payloadPreview && (
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Payload</h2>
          <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
            {payloadPreview}
          </pre>
        </section>
      )}

      {(globalError || apiError) && (
        <p className="text-sm text-red-600" role="alert">
          {globalError ?? apiError}
        </p>
      )}

      {successUser && successSession && (
        <p className="text-sm text-emerald-600" role="status">
          Autenticado como {successUser.email} (sessionId: {successSession})
        </p>
      )}

      <nav className="grid gap-2 text-sm font-medium text-blue-600">
        <Link className="hover:underline" href="/api/auth/me" prefetch={false} target="_blank">
          Verificar /api/auth/me (abre em nova aba)
        </Link>
        <Link className="hover:underline" href="/logout">
          Ir para logout
        </Link>
        <Link className="hover:underline" href="/">
          Voltar para a home
        </Link>
      </nav>
    </main>
  );
}
