import { CheckIcon } from "lucide-react";
import { Metadata } from "next";

const pageTitle = "Registration Successful";

export const metadata: Metadata = {
  title: pageTitle,
};

const RegistrationSuccess = () => {
  return (
    <div className="w-full h-80 p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-3xl border dark:border-gray-600 text-primary size-20 flex items-center justify-center mb-4">
          <CheckIcon size={50} />
        </div>
        <h2 className="font-bold text-2xl mb-1">Done!</h2>
        <p className="text-gray-500 mb-8">Sign Up Successful!</p>
        <p className="text-center text-sm">
          An email has been sent to your registered email address for
          verification
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
