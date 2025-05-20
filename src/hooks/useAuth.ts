// hooks/useAuth.ts (Updated with login attempt limiting)
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type UserRole = "USER" | "ORGANIZER" | "ADMIN";

type RouteConfig = {
  authRoutes: string[];
  protectedRoutes: string[];
  redirectAfterLogin: Record<UserRole, string>;
  roleBasedAccess: Record<string, UserRole[]>;
};

interface LoginAttemptData {
  failedAttempts: number;
  blockedUntil: number | null;
}

const defaultRouteConfig: RouteConfig = {
  authRoutes: [
    "/login",
    "/register",
    "/register-organizer",
    "/forgot-password",
    "/reset-password",
  ],
  protectedRoutes: ["/profile", "/write", "/dashboard", "/admin"],
  redirectAfterLogin: {
    USER: "/",
    ORGANIZER: "/dashboard",
    ADMIN: "/admin",
  },
  roleBasedAccess: {
    "/admin": ["ADMIN"],
    "/dashboard": ["ADMIN", "ORGANIZER"],
    "/profile": ["USER", "ORGANIZER", "ADMIN"],
    "/write": ["USER", "ORGANIZER", "ADMIN"],
  },
};

const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 5 * 60 * 1000;

export function useAuth(customConfig?: Partial<RouteConfig>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loginAttemptData, setLoginAttemptData] = useState<LoginAttemptData>({
    failedAttempts: 0,
    blockedUntil: null,
  });

  const config = customConfig
    ? { ...defaultRouteConfig, ...customConfig }
    : defaultRouteConfig;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("loginAttempts");
      if (storedData) {
        const parsedData = JSON.parse(storedData) as LoginAttemptData;
        setLoginAttemptData(parsedData);
      }
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    const userRole = session?.user?.role as UserRole | undefined;
    const currentPath = pathname;

    const isAuthRoute = config.authRoutes.some(
      (route) => currentPath.startsWith(route) || currentPath === route,
    );

    const isProtectedRoute = config.protectedRoutes.some(
      (route) => currentPath.startsWith(route) || currentPath === route,
    );

    const requiredRoles = Object.entries(config.roleBasedAccess).find(
      ([route]) => currentPath.startsWith(route) || currentPath === route,
    )?.[1];

    if (session && isAuthRoute) {
      const redirectPath = userRole ? config.redirectAfterLogin[userRole] : "/";
      router.replace(redirectPath);
      return;
    }

    if (!session && isProtectedRoute) {
      router.replace("/login");
      return;
    }

    if (session && requiredRoles) {
      const hasRequiredRole = userRole
        ? requiredRoles.includes(userRole)
        : false;

      if (!hasRequiredRole) {
        const redirectPath = userRole
          ? config.redirectAfterLogin[userRole]
          : "/";
        router.replace(redirectPath);
        return;
      }
      setIsAuthorized(true);
    } else {
      setIsAuthorized(session ? true : !isProtectedRoute);
    }
  }, [session, status, pathname, router, config]);

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    const userRole = session?.user?.role as UserRole | undefined;
    if (!userRole) return false;

    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return roles === userRole;
  };

  const canAccess = (route: string): boolean => {
    const userRole = session?.user?.role as UserRole | undefined;
    if (!userRole)
      return !config.protectedRoutes.some(
        (r) => route.startsWith(r) || route === r,
      );

    const requiredRoles = Object.entries(config.roleBasedAccess).find(
      ([r]) => route.startsWith(r) || route === r,
    )?.[1];

    if (!requiredRoles) return true;
    return requiredRoles.includes(userRole);
  };

  const handleFailedLogin = () => {
    if (
      loginAttemptData.blockedUntil &&
      loginAttemptData.blockedUntil > Date.now()
    ) {
      const remainingTime = Math.ceil(
        (loginAttemptData.blockedUntil - Date.now()) / 1000 / 60,
      );
      return {
        isBlocked: true,
        remainingTime,
        message: `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingTime} menit.`,
      };
    }

    if (
      loginAttemptData.blockedUntil &&
      loginAttemptData.blockedUntil <= Date.now()
    ) {
      const newAttemptData = { failedAttempts: 1, blockedUntil: null };
      setLoginAttemptData(newAttemptData);
      localStorage.setItem("loginAttempts", JSON.stringify(newAttemptData));
      return {
        isBlocked: false,
        remainingAttempts: MAX_LOGIN_ATTEMPTS - 1,
        message: `Login gagal. Anda memiliki ${MAX_LOGIN_ATTEMPTS - 1} percobaan lagi.`,
      };
    }

    const failedAttempts = loginAttemptData.failedAttempts + 1;
    let blockedUntil = null;
    let isBlocked = false;
    let message = "";

    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      blockedUntil = Date.now() + BLOCK_DURATION_MS;
      isBlocked = true;
      message = "Terlalu banyak percobaan gagal. Akun diblokir selama 5 menit.";
    } else {
      message = `Login gagal. Anda memiliki ${MAX_LOGIN_ATTEMPTS - failedAttempts} percobaan lagi.`;
    }

    const newAttemptData = { failedAttempts, blockedUntil };
    setLoginAttemptData(newAttemptData);
    localStorage.setItem("loginAttempts", JSON.stringify(newAttemptData));

    return {
      isBlocked,
      remainingAttempts: MAX_LOGIN_ATTEMPTS - failedAttempts,
      message,
    };
  };

  const resetLoginAttempts = () => {
    const newAttemptData = { failedAttempts: 0, blockedUntil: null };
    setLoginAttemptData(newAttemptData);
    localStorage.setItem("loginAttempts", JSON.stringify(newAttemptData));
  };

  const isLoginBlocked = () => {
    if (!loginAttemptData.blockedUntil) return false;
    return loginAttemptData.blockedUntil > Date.now();
  };

  const getBlockRemainingTime = () => {
    if (!loginAttemptData.blockedUntil) return 0;
    const remainingMs = Math.max(0, loginAttemptData.blockedUntil - Date.now());
    return Math.ceil(remainingMs / 1000 / 60); // Konversi ke menit dan bulatkan ke atas
  };

  return {
    session,
    status,
    isAuthorized,
    hasRole,
    canAccess,
    userRole: session?.user?.role as UserRole | undefined,
    isAuthenticated: !!session,
    handleFailedLogin,
    resetLoginAttempts,
    isLoginBlocked,
    getBlockRemainingTime,
    loginAttempts: loginAttemptData.failedAttempts,
  };
}
