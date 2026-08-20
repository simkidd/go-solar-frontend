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
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">Create new password</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Please enter your new password below. Ensure it is secure and easy to remember.
        </p>
      </div>

      <ResetPswForm token={token} />
    </div>
  );
};

export default ResetPassword;
