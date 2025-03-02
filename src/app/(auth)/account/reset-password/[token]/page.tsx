import ResetPswForm from "@/app/(auth)/components/ResetPswForm";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Reset your password";

export const metadata: Metadata = {
  title: pageTitle,
};

const ResetPassword = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;
  return (
    <div className="w-full">
      <h3 className="mb-2 text-center text-2xl font-semibold">
        Reset your password
      </h3>
      <p className="text-sm text-center mb-8">Please enter a new password.</p>
      <ResetPswForm token={token} />
    </div>
  );
};

export default ResetPassword;
