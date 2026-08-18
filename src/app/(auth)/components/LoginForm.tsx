"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { LoginInput } from "@/interfaces/auth.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  LockIcon,
  MailIcon,
  MailWarning,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  useLoginMutation,
  useResendVerificationMutation,
} from "@/hooks/mutations/useAuthMutations";
import Link from "next/link";

// ─── Unverified Account Banner ─────────────────────────────────────────────────
const UnverifiedBanner: React.FC<{ email: string; onBack: () => void }> = ({
  email,
  onBack,
}) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const resendMutation = useResendVerificationMutation();

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = useCallback(() => {
    if (!canResend) return;
    resendMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setCanResend(false);
          setCountdown(60);
        },
      }
    );
  }, [canResend, email, resendMutation]);

  return (
    <div className="flex flex-col items-center text-center space-y-5 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-inter">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
        <MailWarning className="w-8 h-8 text-amber-500" />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">
          Account not verified
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
          Your account hasn&apos;t been activated yet. Check your inbox for the
          verification link sent to
        </p>
        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2 inline-block">
          {email}
        </p>
      </div>

      {/* Resend Button */}
      <div className="w-full space-y-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canResend || resendMutation.isPending}
          onClick={handleResend}
          className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-700 text-xs font-bold gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${resendMutation.isPending ? "animate-spin" : ""}`}
          />
          {resendMutation.isPending
            ? "Sending..."
            : canResend
              ? "Resend Verification Email"
              : `Resend in 0:${String(countdown).padStart(2, "0")}`}
        </Button>
        <p className="text-[10px] text-zinc-400 text-center">
          Didn&apos;t receive it? Check your spam folder.
        </p>
      </div>

      {/* Back to login */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
      >
        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        Back to login
      </button>
    </div>
  );
};

// ─── Login Form ────────────────────────────────────────────────────────────────
const LoginForm = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "";
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const loginMutation = useLoginMutation(redirectUrl, (email) => {
    setUnverifiedEmail(email);
  });

  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) => {
    loginMutation.mutate(values);
  };

  if (unverifiedEmail) {
    return <UnverifiedBanner email={unverifiedEmail} onBack={() => setUnverifiedEmail(null)} />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Welcome back!
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Let&apos;s get you plugged in. Manage your solar products, track your
          installations, and keep the power flowing.
        </p>
      </div>

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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              type="button"
              onClick={() => setIsVisible(!isVisible)}
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

      {/* Footer */}
      <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
        <p className="text-xs text-center text-zinc-500">
          Forgot password?{" "}
          <Link href="/auth/forgot-password" className="font-semibold text-primary hover:underline">
            Reset password
          </Link>
        </p>
        <p className="text-xs text-center text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
