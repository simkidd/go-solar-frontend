"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginInput } from "@/interfaces/auth.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockIcon, MailIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLoginMutation } from "@/hooks/mutations/useAuthMutations";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "";
  const loginMutation = useLoginMutation(redirectUrl);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    loginMutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      {/* Email input */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type="email"
            placeholder="Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Please enter a valid email address",
              },
            })}
            className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        </div>
        {errors.email && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password input */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full h-11 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
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
        {errors.password && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
