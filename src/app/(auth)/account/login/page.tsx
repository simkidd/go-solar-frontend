import LoginForm from "@/app/(auth)/components/LoginForm";
import { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Log into an account";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const LoginPage = () => {
  return (
    <div className="w-full">
      <h3 className="mb-6 text-center text-2xl font-semibold">Login</h3>
      <LoginForm />
      <div>
        <p className="text-sm text-center mb-4">
          Forgot password?{" "}
          <Link
            href="/account/forgot-password"
            className="font-medium hover:underline"
          >
            Reset
          </Link>
        </p>
        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link
            href="/account/register"
            className="font-medium hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
