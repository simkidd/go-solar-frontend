import VerifyForm from "@/app/(auth)/components/VerifyForm";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Verify account";

export const metadata: Metadata = {
  title: pageTitle,
};

const VerifyEmailToken = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;
  return (
    <div className="w-full">
      {token ? (
        <VerifyForm token={token} />
      ) : (
        <div className="">
          <input type="text" placeholder="enter email" />
        </div>
      )}
    </div>
  );
};

export default VerifyEmailToken;
