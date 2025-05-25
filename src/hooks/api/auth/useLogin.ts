"use client";
import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const useLogin = () => {
  const router = useRouter();
  const {
    handleFailedLogin,
    resetLoginAttempts,
    isLoginBlocked,
    getBlockRemainingTime,
  } = useAuth();

  useEffect(() => {
    if (isLoginBlocked()) {
      const remainingTime = getBlockRemainingTime();
      toast.error(
        `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingTime} menit.`,
      );
    }
  }, []);

  return useMutation({
    mutationFn: async (payload: Pick<User, "email" | "password">) => {
      if (isLoginBlocked()) {
        const remainingTime = getBlockRemainingTime();
        const blockMessage = `Terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingTime} menit.`;
        toast.error(blockMessage);
        throw new Error(blockMessage);
      }

      try {
        const { data } = await axiosInstance.post("api/auth/login", payload);

        resetLoginAttempts();
        return data;
      } catch (error) {
        const failedAttemptResult = handleFailedLogin();
        toast.error(failedAttemptResult.message);

        throw error;
      }
    },
    onSuccess: async (data) => {
      await signIn("credentials", { ...data, redirect: false });
      toast.success("Login success");

      resetLoginAttempts();

      const role = data.user.role;
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "ORGANIZER") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    },
    onError: (error: AxiosError<any>) => {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    },
  });
};

export default useLogin;
