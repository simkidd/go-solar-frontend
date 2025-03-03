/* eslint-disable react/no-unescaped-entities */

import LoginForm from "@/app/(auth)/components/LoginForm";
import { Metadata } from "next";
import Link from "next/link";
import SignUpButton from "../../components/SignUpButton";

const pageTitle = "Log into an account";

export const metadata: Metadata = {
  title: pageTitle,
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
        <Link href="/account/register">
          <SignUpButton />
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
