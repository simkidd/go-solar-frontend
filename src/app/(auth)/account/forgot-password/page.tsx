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
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Forgot password?</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          No worries. Enter your registered email address and we’ll send you a link to reset your password.
        </p>
      </div>

      <ForgetPswForm />

      <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
        <p className="text-xs text-center text-zinc-500">
          Remembered your password?{" "}
          <Link
            href="/account/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
