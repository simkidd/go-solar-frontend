import SignUpForm from "@/app/(auth)/components/SignUpForm";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

const pageTitle = "Create your GoSolar account";

export const metadata: Metadata = {
  title: pageTitle,
};

const RegisterPage = () => {
  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Create your account</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Start your clean energy transition. Set up an account to browse packages, order components, and request professional installations.
        </p>
      </div>

      <SignUpForm />

      <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
        <p className="text-xs text-center text-zinc-500">
          Already have an account?{" "}
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

export default RegisterPage;
