import ForgotPasswordPage from "@/features/forgot-password";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const ForgotPassword = async () => {
  const session = await auth();

  if (session?.user) {
    const role = session.user.role;

    if (role === "ADMIN") {
      redirect("/admin");
    } else if (role === "ORGANIZER") {
      redirect("/dashboard");
    } else {
      redirect("/");
    }
  }
  return <ForgotPasswordPage />;
};

export default ForgotPassword;
