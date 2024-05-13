"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import React, { useMemo, useState } from "react";

const ResetPswForm: React.FC<{ token: string }> = ({ token }) => {
  const { loading, resetPassword } = useAuthStore();
  const [input, setInput] = useState({
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validatePassword = (input: string) => input.length >= 6;

  const isPasswordInvalid = useMemo(() => {
    if (input.password === "") return false;
    return !validatePassword(input.password);
  }, [input.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!input.password) {
    //   alert("Field is required");
    //   return;
    // }
    if (token) {
      await resetPassword(input, token);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="input-group mb-4">
        <Input
          type={isVisible ? "text" : "password"}
          variant="underlined"
          label="Password"
          name="password"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
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
          color={isPasswordInvalid ? "danger" : "success"}
          errorMessage={
            isPasswordInvalid && "Password must be at least 6 characters"
          }
          value={input?.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
        />
      </div>

      <button
        className="w-full bg-primary text-white py-2 px-8 mt-8 disabled:bg-gray-400"
        disabled={!input.password || isPasswordInvalid}
      >
        {loading ? "Loading..." : "Reset"}
      </button>
    </form>
  );
};

export default ResetPswForm;
