import ResetPasswordPage from "@/features/reset-password";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ResetPassword = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
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
  const token = (await params).token;
  return <ResetPasswordPage token={token} />;
};

export default ResetPassword;
