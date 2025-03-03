"use client";
import { LoginInput } from "@/interfaces/auth.interface";
import { LoginApiResponse } from "@/interfaces/types";
import { axiosInstance } from "@/lib/axios";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import { Button, Input } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const LoginForm = () => {
  const searchParams = useSearchParams();
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

      const userToken = JSON.stringify(user);
      if (userToken) {
        Cookies.set(USER_DETAILS, userToken);
        Cookies.set(TOKEN_NAME, user.token);
        toast.success(data.message);
        window.location.href = redirectUrl;
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      alert("All fields are required");
      return;
    }

    await loginMutation.mutateAsync({
      email: input.email,
      password: input.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="input-group mb-3">
        <Input
          type="email"
          variant="underlined"
          label="Email"
          name="email"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          color={isEmailInvalid ? "danger" : "success"}
          errorMessage={isEmailInvalid && "Please enter a valid email address"}
          value={input?.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
        />
      </div>
      <div className="input-group mb-4">
        <Input
          type={isVisible ? "text" : "password"}
          variant="underlined"
          label="Password"
          name="password"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
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
          color={isPasswordInvalid ? "danger" : "success"}
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
        className="w-full rounded-none disabled:!bg-gray-400 mt-4"
        isLoading={loginMutation.isPending}
        isDisabled={
          !input.password || isPasswordInvalid || loginMutation.isPending
        }
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
