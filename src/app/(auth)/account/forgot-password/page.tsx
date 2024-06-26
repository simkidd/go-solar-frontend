import ForgetPswForm from "@/app/(auth)/components/ForgetPswForm";
import { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Forgot your password";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const ForgotPassword = () => {
  return (
    <div className="w-full">
      <h3 className="mb-2 text-center text-2xl font-semibold">Forgot your password</h3>
      <p className="text-sm text-center mb-8">Please provide an email address.</p>
      <ForgetPswForm />
      <div>
        <p className="text-sm text-center">
          <Link
            href="/account/login"
            className="font-medium hover:underline text-gray-400 hover:text-gray-600"
          >
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
