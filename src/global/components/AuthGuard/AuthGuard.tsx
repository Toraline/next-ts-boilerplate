"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createAuthClient } from "lib/auth/client";
import { GLOBAL_UI } from "global/constants/ui";

const authClient = createAuthClient();

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
    retry: false,
  });

  useEffect(() => {
    if (sessionQuery.data === null) {
      router.push("/login");
    }
  }, [sessionQuery.data, router]);

  // Show loading while checking session
  if (sessionQuery.isLoading || sessionQuery.data === undefined) {
    return <div>{GLOBAL_UI.LOADING.DEFAULT}</div>;
  }

  // Render children if authenticated (useEffect handles redirect if not authenticated)
  return <>{children}</>;
}
