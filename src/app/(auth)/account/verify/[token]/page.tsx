import VerifyForm from "@/components/VerifyForm";
import React from "react";

const VerifyEmail = ({ params: { token } }: { params: { token: string } }) => {
  return (
    <div className="w-full">
      {/* <h3 className="mb-2 text-center text-2xl font-semibold">
        Forgot your password
      </h3>
      <p className="text-sm text-center mb-8">
        Please provide an email address.
      </p> */}
      {token ? (
        <VerifyForm token={token} />
      ) : (
        <div>
          {/* <p className="text-sm text-center">
          <Link
            href="/account/login"
            className="font-medium hover:underline text-gray-400 hover:text-gray-600"
          >
            Go back
          </Link>
        </p> */}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
