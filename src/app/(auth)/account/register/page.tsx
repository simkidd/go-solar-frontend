import { Metadata } from "next";
import React from "react";
import SignUpForm from "@/components/SignUpForm";
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
      <h3 className="mb-6 text-center text-2xl font-semibold">Register</h3>
      <SignUpForm />
      <div>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/account/login" className="font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
