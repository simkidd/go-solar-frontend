import VerifyForm from "@/app/(auth)/components/VerifyForm";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Verify account";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const VerifyEmailToken = ({
  params: { token },
}: {
  params: { token: string };
}) => {
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
