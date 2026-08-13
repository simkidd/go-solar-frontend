import {
  EmailInput,
  ForgetPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignUpInput,
  VerifyAccountInput,
} from "@/interfaces/auth.interface";
import { axiosInstance } from "@/lib/axios";
import { REFRESH_TOKEN_NAME, TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLoginMutation = (redirectUrl?: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await axiosInstance.post("/auth/login", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Login successful!");
      const token = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;
      const user = data?.user;

      if (token) Cookies.set(TOKEN_NAME, token, { expires: 1 });
      if (refreshToken) Cookies.set(REFRESH_TOKEN_NAME, refreshToken, { expires: 30 });
      if (user) Cookies.set(USER_DETAILS, JSON.stringify(user), { expires: 30 });

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (user?.role === "admin" || user?.role === "superAdmin") {
        router.push("/dashboard");
      } else {
        router.push("/shop");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message);
    },
  });
};

export const useSignUpMutation = (onSuccessCallback?: (email: string) => void) => {
  return useMutation({
    mutationFn: async (input: SignUpInput) => {
      const { data } = await axiosInstance.post("/auth/signup", input);
      return { ...data, _inputEmail: input.email };
    },
    onSuccess: (data) => {
      onSuccessCallback?.(data?._inputEmail || "");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (input: ForgetPasswordInput) => {
      const { data } = await axiosInstance.post("/auth/forgot-password", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Reset link sent to your email!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to send reset link";
      toast.error(message);
    },
  });
};

export const useResetPasswordMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: ResetPasswordInput) => {
      const { data } = await axiosInstance.post("/auth/reset-password", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully!");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
    },
  });
};

export const useVerifyAccountMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: VerifyAccountInput) => {
      const { data } = await axiosInstance.post("/auth/verify-email", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Account verified successfully!");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
    },
  });
};

export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: async (input: EmailInput) => {
      const { data } = await axiosInstance.post(
        `/auth/request-verification/${encodeURIComponent(input.email)}`
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Verification email sent!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to resend verification";
      toast.error(message);
    },
  });
};
