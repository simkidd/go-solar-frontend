import LoginForm from "@/app/(auth)/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log into your account",
  description:
    "Welcome back! Log in to manage your solar products, track installations, and keep the power flowing.",
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
