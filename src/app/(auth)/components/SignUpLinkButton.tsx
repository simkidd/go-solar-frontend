"use client";
import { Button } from "@heroui/react";
import React from "react";

const SignUpLinkButton = () => {
  return (
    <Button
      variant="bordered"
      color="primary"
      className="w-full data-[focus-visible=true]:outline-primary"
    >
      Signup
    </Button>
  );
};

export default SignUpLinkButton;
