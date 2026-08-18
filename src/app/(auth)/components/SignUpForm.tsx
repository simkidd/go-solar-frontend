"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  LockIcon,
  MailIcon,
  User2Icon,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSignUpMutation } from "@/hooks/mutations/useAuthMutations";
import { useResendVerificationMutation } from "@/hooks/mutations/useAuthMutations";
import Link from "next/link";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phonenumber: string;
  password: string;
  confirmPassword: string;
}

// ─── Verification Confirmation Card ────────────────────────────────────────────
const VerificationCard: React.FC<{ email: string }> = ({ email }) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const resendMutation = useResendVerificationMutation();

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
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
      {/* Success Icon */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-[#08AA08]/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[#08AA08]" />
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#08AA08] rounded-full flex items-center justify-center">
          <MailIcon className="w-2.5 h-2.5 text-white" />
        </span>
      </div>

      {/* Heading */}
      <div className="space-y-1.5">
        <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">
          Check your inbox!
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
          We&apos;ve sent an activation link to
        </p>
        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2 inline-block">
          {email}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Click the link in the email to activate your account.
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

      {/* Divider */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Already verified link */}
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
      >
        Already verified? Log in
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

// ─── Main SignUp Form ───────────────────────────────────────────────────────────
const SignUpForm = () => {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const signupMutation = useSignUpMutation((email) => {
    setVerifiedEmail(email);
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phonenumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = (values: FormValues) => {
    signupMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phonenumber: values.phonenumber,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  // Show in-place verification card after successful signup
  if (verifiedEmail) {
    return <VerificationCard email={verifiedEmail} />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Start your clean energy transition. Set up an account to browse
          packages, order components, and request professional installations.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="relative">
            <Input
              placeholder="First Name"
              {...register("firstName", { required: "First name is required" })}
              className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
            />
            <User2Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>
          {errors.firstName && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Input
              placeholder="Last Name"
              {...register("lastName", { required: "Last name is required" })}
              className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
            />
            <User2Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>
          {errors.lastName && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

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

      {/* Phone input */}
      <div className="space-y-1">
        <Controller
          control={control}
          name="phonenumber"
          rules={{
            required: "Phone number is required",
            validate: (value) =>
              (value && isValidPhoneNumber(value)) || "Invalid phone number",
          }}
          render={({ field }) => (
            <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 bg-white dark:bg-zinc-900 flex items-center">
              <PhoneInput
                placeholder="Phone number"
                defaultCountry="NG"
                value={field.value}
                onChange={field.onChange}
                className="w-full text-xs font-semibold focus:outline-none"
              />
            </div>
          )}
        />
        {errors.phonenumber && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.phonenumber.message}
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

      {/* Confirm password input */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={confirmVisible ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => val === password || "Passwords do not match",
            })}
            className="w-full h-11 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
            type="button"
            onClick={() => setConfirmVisible(!confirmVisible)}
          >
            {confirmVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 mt-2"
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? "Creating Account..." : "Create Account"}
      </Button>
    </form>

    {/* Footer */}
    <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
      <p className="text-xs text-center text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  </div>
  );
};

export default SignUpForm;
