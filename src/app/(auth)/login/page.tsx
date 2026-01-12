"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAuthClient, type LoginRequest, type LoginResponse } from "lib/auth/client";
import { loginRequestSchema } from "server/auth/schemas";
import { Field } from "global/ui/Field/Field";
import { Button } from "global/ui";
import { useMutation } from "global/hooks/useMutation";
import type { ApiError } from "lib/client/errors";
import { toast } from "sonner";

const authClient = createAuthClient();

type LoginFormValues = z.infer<typeof loginRequestSchema>;

const DEFAULT_VALUES: LoginFormValues = {
  email: "",
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  const signInMutation = useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: async (payload) => authClient.signIn(payload),
  });

  const onSubmit = (values: LoginFormValues) => {
    // Check if user is already logged in
    if (sessionQuery.data?.user) {
      router.push("/");
      return;
    }

    const payload: LoginRequest = {
      email: values.email.trim(),
    };

    signInMutation.mutate(payload, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message || "Erro ao fazer login");
      },
    });
  };

  const isLoading = isSubmitting || signInMutation.isPending;

  return (
    <main className="mx-auto max-w-xl space-y-6 px-6 py-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Login Fake Provider</h1>
        <p className="text-base text-slate-600">
          Cada login cria uma sessão independente e define o cookie{" "}
          <code className="font-mono text-sm">s_session</code>.
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
          {...register("email")}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

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
