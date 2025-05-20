"use client";

import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useLogin = () => {
  const router = useRouter();
  // const { onAuthSuccess } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: Pick<User, "email" | "password">) => {
      const { data } = await axiosInstance.post("/auth/login", payload);
      return data;
    },
    onSuccess: async (data) => {
      await signIn("credentials", { ...data, redirect: false });
      toast.success("Login success");
      const role = data.user.role;
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "ORGANIZER") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      // onAuthSuccess({ user: data, accessToken: data.accessToken });
      router.push("/");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};

export default useLogin;
