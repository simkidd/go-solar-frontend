import VerifyForm from "@/components/VerifyForm";
import React from "react";

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
