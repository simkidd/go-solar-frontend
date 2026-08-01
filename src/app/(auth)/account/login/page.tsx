/* eslint-disable react/no-unescaped-entities */
import LoginForm from "@/app/(auth)/components/LoginForm";
import { Metadata } from "next";
import Link from "next/link";
import SignUpLinkButton from "../../components/SignUpLinkButton";

const pageTitle = "Log into your account";

export const metadata: Metadata = {
  title: pageTitle,
};

const LoginPage = () => {
  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Welcome back!</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Let’s get you plugged in. Manage your solar products, track your installations, and keep the power flowing.
        </p>
      </div>

      <LoginForm />

      <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
        <p className="text-xs text-center text-zinc-500">
          Forgot password?{" "}
          <Link
            href="/account/forgot-password"
            className="font-semibold text-primary hover:underline"
          >
            Reset password
          </Link>
        </p>

        <p className="text-xs text-center text-zinc-500">
          Don't have an account?{" "}
          <Link
            href="/account/register"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
