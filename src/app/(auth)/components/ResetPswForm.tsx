"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button, Input } from "@heroui/react";
import { Eye, EyeOff, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

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
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="input-group mb-4">
        <Input
          type={isVisible ? "text" : "password"}
          placeholder="Password"
          name="password"
          className="w-full"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeOff
                  size={20}
                  className="text-default-400 pointer-events-none"
                />
              ) : (
                <Eye
                  size={20}
                  className="text-default-400 pointer-events-none"
                />
              )}
            </button>
          }
          errorMessage={
            isPasswordInvalid && "Password must be at least 6 characters"
          }
          value={input?.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
          startContent={
            <LockIcon
              size={16}
              className="text-default-400 pointer-events-none flex-shrink-0"
            />
          }
        />
      </div>

      <Button
        color="primary"
        className="w-full mt-8 disabled:bg-gray-400"
        disabled={!input.password || isPasswordInvalid}
        isLoading={loading}
      >
        Reset
      </Button>
    </form>
  );
};

export default ResetPswForm;
