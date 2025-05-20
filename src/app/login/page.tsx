import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginPage from "@/features/login";

export default async function Login() {
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

  return <LoginPage />;
}
