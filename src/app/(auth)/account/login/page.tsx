/* eslint-disable react/no-unescaped-entities */

import LoginForm from "@/app/(auth)/components/LoginForm";
import { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Log into an account";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const LoginPage = () => {
  return (
    <div className="w-full">
      <h3 className="mb-6 text-center text-2xl font-semibold">Login</h3>
      <LoginForm />
      <div className="mb-4">
        <p className="text-sm text-center">
          Forgot password?{" "}
          <Link
            href="/account/forgot-password"
            className="font-medium hover:underline text-primary"
          >
            Reset
          </Link>
        </p>
      </div>

      <div className="flex flex-col mt-2">
        <p className="text-sm text-center mb-2">Don't have an account?</p>
        <Link
          href="/account/register"
          className="font-medium border border-primary text-primary hover:bg-primary hover:text-white transition-colors transition-background py-2 px-8 flex justify-center items-center"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
