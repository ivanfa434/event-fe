// contoh menggunakan client component
// features/login/index.tsx
"use client";
import React from "react";
import { LoginForm } from "./components/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import AuthGuard from "@/components/guards/AuthGuard";

const LoginPage = () => {
  const { status, isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "loading") return;

    if (isAuthenticated) {
      if (userRole === "ADMIN") {
        router.replace("/admin");
      } else if (userRole === "ORGANIZER") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [isAuthenticated, status, userRole, router]);

  if (status === "loading" || isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthGuard authPage={true}>
          <LoginForm />
        </AuthGuard>
      </div>
    </div>
  );
};

export default LoginPage;
