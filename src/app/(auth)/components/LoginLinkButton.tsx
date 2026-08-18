"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const LoginLinkButton = () => {
  return (
    <Button
      variant="outline"
      className="w-full border-primary text-primary hover:bg-primary/5 font-bold text-xs uppercase tracking-wider rounded-xl h-10"
    >
      Sign In
    </Button>
  );
};

export default LoginLinkButton;
