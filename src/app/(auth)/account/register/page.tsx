import { Metadata } from "next";
import React from "react";
import SignUpForm from "@/app/(auth)/components/SignUpForm";
import Link from "next/link";

const pageTitle = "Create an account";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const RegisterPage = () => {
  return (
    <div className="w-full">
      <h3 className="mb-6 text-center text-2xl font-semibold">
        Create an account
      </h3>
      <SignUpForm />
      <div className="flex flex-col">
        <p className="text-sm text-center mb-2">Already have an account? </p>
        <Link
          href="/account/login"
          className="font-medium border border-primary text-primary hover:bg-primary hover:text-white transition-colors transition-background py-2 px-8 flex justify-center items-center"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
