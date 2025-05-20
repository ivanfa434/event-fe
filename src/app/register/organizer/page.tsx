import RegisterOrganizerPage from "@/features/register-organizer";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const Organizer = async () => {
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
  return <RegisterOrganizerPage />;
};

export default Organizer;
