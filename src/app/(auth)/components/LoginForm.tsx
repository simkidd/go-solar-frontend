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
    <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 font-inter">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 flex items-center justify-center relative">
        <MailWarning className="w-8 h-8 text-amber-500" strokeWidth={1.5} />
        <div className="absolute inset-0 rounded-2xl border border-amber-500/20 animate-ping opacity-40" />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Verify your email
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
          Your account is registered but not active. We sent a verification link to:
        </p>
        <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl px-4 py-2.5 inline-block font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
          {email}
        </div>
      </div>

      {/* Resend Button */}
      <div className="w-full space-y-2 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canResend || resendMutation.isPending}
          onClick={handleResend}
          className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-bold gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 text-zinc-500 ${resendMutation.isPending ? "animate-spin" : ""}`}
          />
          {resendMutation.isPending
            ? "Sending..."
            : canResend
              ? "Resend Verification Email"
              : `Resend in 0:${String(countdown).padStart(2, "0")}`}
        </Button>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center">
          Can&apos;t find it? Check your spam folder or try resending.
        </p>
      </div>

      {/* Back to login */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors pt-2"
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
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          Welcome back
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Manage your solar products, track your installations, and keep the power flowing.
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
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-250 bg-zinc-50/50 dark:bg-zinc-950/20"
            />
            <MailIcon 
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-250 pointer-events-none ${
                isEmailFocused ? "text-primary" : "text-zinc-400"
              }`} 
            />
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
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="w-full h-11 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-250 bg-zinc-50/50 dark:bg-zinc-950/20"
            />
            <LockIcon 
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-250 pointer-events-none ${
                isPasswordFocused ? "text-primary" : "text-zinc-400"
              }`} 
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
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

        <div className="flex justify-end text-xs pt-0.5">
          <Link href="/auth/forgot-password" className="font-semibold text-zinc-550 dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 shadow-md shadow-emerald-550/5 transition-all active:scale-[0.985] cursor-pointer"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-5 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
