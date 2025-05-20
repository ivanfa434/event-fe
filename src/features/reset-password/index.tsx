"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import AuthGuard from "@/components/guards/AuthGuard";

interface ResetPasswordPageProps {
  token: string;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  if (session) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthGuard authPage={true}>
          <ResetPasswordForm token={token} />
        </AuthGuard>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
