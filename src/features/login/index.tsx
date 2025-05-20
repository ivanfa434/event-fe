"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginForm } from "./components/LoginForm";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // tunggu session load dulu
    if (session) {
      // redirect sesuai role
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/"); // user biasa atau organizer ke homepage
      }
    }
  }, [session, status, router]);

  // Saat loading session atau redirect, bisa tampil loading atau null
  if (session) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
