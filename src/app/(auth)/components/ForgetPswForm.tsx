"use client";
import React, { useMemo, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-4 font-inter">
      <div className="relative">
        <Input
          type="email"
          placeholder="Enter email address"
          name="email"
          className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          value={input?.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          required
        />
        <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
      </div>

      {isEmailInvalid && (
        <p className="text-[11px] text-rose-500 font-semibold pl-1">Please enter a valid email address</p>
      )}

      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11"
        disabled={!input.email || isEmailInvalid || loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
};

export default ForgetPswForm;
