"use client";
import { Button } from "@heroui/react";
import React from "react";

const LoginLinkButton = () => {
  return (
    <Button
      variant="bordered"
      color="primary"
      className="w-full data-[focus-visible=true]:outline-primary"
    >
      Login
    </Button>
  );
};

export default LoginLinkButton;
