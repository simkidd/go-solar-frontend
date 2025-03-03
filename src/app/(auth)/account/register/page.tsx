import { Metadata } from "next";
import React from "react";
import SignUpForm from "@/app/(auth)/components/SignUpForm";
import Link from "next/link";
import LoginLinkButton from "../../components/LoginLinkButton";

const pageTitle = "Create an account";

export const metadata: Metadata = {
  title: pageTitle,
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
        <Link href="/account/login">
          <LoginLinkButton />
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
