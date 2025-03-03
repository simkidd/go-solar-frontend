"use client";
import { useSession } from "@/context/SessionContext";
import { LoginInput } from "@/interfaces/auth.interface";
import { ErrorResponse, LoginApiResponse } from "@/interfaces/types";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import { addToast, Button, Input } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const validateEmail = (input: string) =>
    input.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (input.email === "") return false;

    return validateEmail(input.email) ? false : true;
  }, [input.email]);

  const validatePassword = (input: string) => input.length >= 6;

  const isPasswordInvalid = useMemo(() => {
    if (input.password === "") return false;
    return !validatePassword(input.password);
  }, [input.password]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const login = async (input: LoginInput): Promise<LoginApiResponse> => {
    const { data } = await axiosInstance.post("/auth/login", input);
    return data;
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const user = data?.data?.user;
      if (!user?.token || !user) return;

      if (!user?.is_verified) {
        toast.warn("Please verify your email to login");
        return;
      }

      setUser(user);
      setIsAuthenticated(true);

      const userToken = JSON.stringify(user);
      if (userToken) {
        Cookies.set(USER_DETAILS, userToken);
        Cookies.set(TOKEN_NAME, user.token);
        // toast.success(data.message);
        addToast({
          title: "Success",
          description: data.message,
          color:"success"
        });
        router.push(redirectUrl);
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const resError = error.response?.data;
      console.error(resError);
      const errorMessage = resError?.message ? resError?.message : resError;
      // toast.error(`Error: ${errorMessage}`);
      addToast({
        title: "Error",
        description: errorMessage as string,
        color:"danger"
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      addToast({
        title: "Attention",
        description: "All fields are required",
        color:"warning"
      });
      return;
    }

    loginMutation.mutate({
      email: input.email,
      password: input.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="input-group mb-3">
        <Input
          type="email"
          label="Email"
          name="email"
          className="w-full"
          labelPlacement="outside"
          placeholder="Enter email address"
          // color={isEmailInvalid ? "danger" : "success"}
          errorMessage={isEmailInvalid && "Please enter a valid email address"}
          value={input?.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
        />
      </div>
      <div className="input-group mb-4">
        <Input
          type={isVisible ? "text" : "password"}
          label="Password"
          name="password"
          className="w-full"
          labelPlacement="outside"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeOff
                  size={20}
                  className="text-default-400 pointer-events-none"
                />
              ) : (
                <Eye
                  size={20}
                  className="text-default-400 pointer-events-none"
                />
              )}
            </button>
          }
          // color={isPasswordInvalid ? "danger" : "success"}
          errorMessage={
            isPasswordInvalid && "Password must be at least 6 characters"
          }
          value={input?.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
        />
      </div>
      <Button
        variant="solid"
        color="primary"
        type="submit"
        className="w-full disabled:!bg-gray-400 mt-4"
        isLoading={loginMutation.isPending}
        isDisabled={!input.password || loginMutation.isPending}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
