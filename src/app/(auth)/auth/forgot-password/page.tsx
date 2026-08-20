import ForgetPswForm from "@/app/(auth)/components/ForgetPswForm";
import { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Forgot your password";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const ForgotPassword = () => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">Forgot password?</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          No worries. Enter your registered email address and we’ll send you a link to reset your password.
        </p>
      </div>

      <ForgetPswForm />

      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-5 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Remembered your password?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
