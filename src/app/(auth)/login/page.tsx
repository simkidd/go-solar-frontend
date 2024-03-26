import { Metadata } from "next";
import React from "react";

const pageTitle = "Log into an account";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const LoginPage = () => {
  return <div>LoginPage</div>;
};

export default LoginPage;
