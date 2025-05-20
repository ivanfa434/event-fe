// components/guards/AuthGuard.tsx
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/hooks/useAuth";
import Loading from "@/components/loading";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  authPage?: boolean;
}

export default function AuthGuard({
  children,
  allowedRoles,
  requireAuth = false,
  authPage = false,
}: AuthGuardProps) {
  const router = useRouter();
  const { session, status, userRole } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (authPage) {
      if (session) {
        const redirectPath =
          userRole === "ADMIN"
            ? "/admin"
            : userRole === "ORGANIZER"
              ? "/dashboard"
              : "/";
        router.replace(redirectPath);
      } else {
        setIsAuthorized(true);
      }
      return;
    }

    if (requireAuth && !session) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && session) {
      const hasPermission = userRole
        ? allowedRoles.includes(userRole as UserRole)
        : false;

      if (!hasPermission) {
        const redirectPath =
          userRole === "ADMIN"
            ? "/admin"
            : userRole === "ORGANIZER"
              ? "/dashboard"
              : "/";
        router.replace(redirectPath);
      } else {
        setIsAuthorized(true);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [session, status, router, userRole, requireAuth, allowedRoles, authPage]);

  if (status === "loading" || !isAuthorized) {
    return <Loading />;
  }

  return <>{children}</>;
}
