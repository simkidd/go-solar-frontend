import SignUpForm from "@/app/(auth)/components/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your GoSolar account",
  description:
    "Start your clean energy transition. Set up an account to browse packages, order components, and request professional installations.",
};

const RegisterPage = () => {
  return <SignUpForm />;
};

export default RegisterPage;
