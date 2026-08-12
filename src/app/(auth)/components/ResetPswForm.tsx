"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockIcon } from "lucide-react";
import { useResetPasswordMutation } from "@/hooks/mutations/useAuthMutations";

interface FormValues {
  password: string;
}

const ResetPswForm: React.FC<{ token: string }> = ({ token }) => {
  const resetPasswordMutation = useResetPasswordMutation();
  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { password: "" },
  });

  const onSubmit = (values: FormValues) => {
    resetPasswordMutation.mutate({
      password: values.password,
      token,
    } as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="New Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full h-11 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11"
        disabled={resetPasswordMutation.isPending}
      >
        {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
};

export default ResetPswForm;
