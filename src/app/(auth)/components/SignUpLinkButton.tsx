"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const SignUpLinkButton = () => {
  return (
    <Button
      variant="outline"
      className="w-full border-primary text-primary hover:bg-primary/5 font-bold text-xs uppercase tracking-wider rounded-xl h-10"
    >
      Sign Up
    </Button>
  );
};

export default SignUpLinkButton;
