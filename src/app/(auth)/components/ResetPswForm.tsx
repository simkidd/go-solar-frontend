"use client";
import React, { useMemo, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const ResetPswForm: React.FC<{ token: string }> = ({ token }) => {
  const { loading, resetPassword } = useAuthStore();
  const [input, setInput] = useState({
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validatePassword = (input: string) => input.length >= 6;

  const isPasswordInvalid = useMemo(() => {
    if (input.password === "") return false;
    return !validatePassword(input.password);
  }, [input.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await resetPassword(input, token);
    setInput({ password: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-inter">
      <div className="relative">
        <Input
          type={isVisible ? "text" : "password"}
          placeholder="New Password"
          name="password"
          className="w-full h-11 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          value={input?.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
          required
        />
        <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {isPasswordInvalid && (
        <p className="text-[11px] text-rose-500 font-semibold pl-1">Password must be at least 6 characters</p>
      )}

      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11"
        disabled={!input.password || isPasswordInvalid || loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
};

export default ResetPswForm;
