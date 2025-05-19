"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button, Input } from "@heroui/react";
import { MailIcon } from "lucide-react";
import React, { useMemo, useState } from "react";

const ForgetPswForm = () => {
  const { loading, forgotPassword } = useAuthStore();
  const [input, setInput] = useState({
    email: "",
  });

  const validateEmail = (input: string) =>
    input.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (input.email === "") return false;

    return validateEmail(input.email) ? false : true;
  }, [input.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await forgotPassword(input);
    setInput({ email: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="input-group mb-3">
        <Input
          type="email"
          labelPlacement="outside"
          placeholder="Enter your email address"
          name="email"
          className="w-full"
          startContent={
            <MailIcon
              size={16}
              className="text-default-400 pointer-events-none flex-shrink-0"
            />
          }
          errorMessage={isEmailInvalid && "Please enter a valid email address"}
          value={input?.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
        />
      </div>

      <Button
        type="submit"
        color="primary"
        className="w-full mt-8 disabled:bg-gray-400"
        disabled={!input.email}
        isLoading={loading}
      >
        Send
      </Button>
    </form>
  );
};

export default ForgetPswForm;
