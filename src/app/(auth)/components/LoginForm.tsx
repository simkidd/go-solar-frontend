"use client";
import React, { useMemo, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { LoginInput } from "@/interfaces/auth.interface";
import { ErrorResponse, LoginApiResponse } from "@/interfaces/types";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

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
        toast.warning("Please verify your email to login");
        return;
      }

      setUser(user);
      setIsAuthenticated(true);

      const userToken = JSON.stringify(user);
      if (userToken) {
        Cookies.set(USER_DETAILS, userToken);
        Cookies.set(TOKEN_NAME, user.token);
        toast.success(data.message || "Logged in successfully!");
        router.push(redirectUrl);
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const resError = error.response?.data;
      console.error(resError);
      const errorMessage = resError?.message ? resError?.message : "Failed to sign in";
      toast.error(errorMessage as string);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      toast.warning("All fields are required");
      return;
    }

    loginMutation.mutate({
      email: input.email,
      password: input.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-inter">
      
      {/* Email input */}
      <div className="relative">
        <Input
          type="email"
          placeholder="Email Address"
          name="email"
          className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          value={input?.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          required
        />
        <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
      </div>
      {isEmailInvalid && (
        <p className="text-[11px] text-rose-500 font-semibold pl-1">Please enter a valid email address</p>
      )}

      {/* Password input */}
      <div className="relative">
        <Input
          type={isVisible ? "text" : "password"}
          placeholder="Password"
          name="password"
          className="w-full h-11 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          value={input?.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
          required
        />
        <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {isPasswordInvalid && (
        <p className="text-[11px] text-rose-500 font-semibold pl-1">Password must be at least 6 characters</p>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11"
        disabled={!input.password || loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>

    </form>
  );
};

export default LoginForm;
