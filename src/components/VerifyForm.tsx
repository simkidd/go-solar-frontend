"use client";
import { Input } from "@nextui-org/react";
import React, { useMemo, useState } from "react";

const VerifyForm: React.FC<{ token: string }> = ({ token }) => {
  const [input, setInput] = useState({
    email: "",
  });
  const [loading, SetLoading] = useState(false);

  const validateEmail = (input: string) =>
    input.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (input.email === "") return false;

    return validateEmail(input.email) ? false : true;
  }, [input.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <h4 className="mb-2 text-center text-2xl font-semibold">
        Resend Verification
      </h4>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="input-group mb-3">
          <Input
            type="email"
            variant="underlined"
            label="Email"
            size="lg"
            className="w-full"
            classNames={{
              label: "text-black/50 dark:text-white/90",
            }}
            errorMessage={
              isEmailInvalid && "Please enter a valid email address"
            }
            value={input?.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
          />
        </div>

        <button className="w-full bg-primary text-white py-2 px-8 mt-8">
          {loading ? "Sending..." : "Resend OTP"}
        </button>
      </form>
    </>
  );
};

export default VerifyForm;
