"use client";

import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RegisterPayload extends User {
  confirmPassword: string;
  bankName: string;
  norek: string;
  npwp: string;
  name: string;
}

const useRegisterAsOrganizer = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: Omit<RegisterPayload, "id" | "profilePicture" | "confirmPassword" | "fullName" | "role">) => {
      const { data } = await axiosInstance.post("/auth/register-organizer", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Register success");
      router.push("/login");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};

export default useRegisterAsOrganizer;
