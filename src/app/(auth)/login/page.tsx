import LoginForm from "@/components/LoginForm";
import AuthLayout from "@/layouts/AuthLayout";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Log into an account";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const LoginPage = () => {
  return (
    <div>
      <h3 className="mb-4">Login</h3>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
