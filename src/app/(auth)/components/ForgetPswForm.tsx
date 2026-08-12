"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailIcon } from "lucide-react";
import { useForgotPasswordMutation } from "@/hooks/mutations/useAuthMutations";

interface FormValues {
  email: string;
}

const ForgetPswForm = () => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit = (values: FormValues) => {
    forgotPasswordMutation.mutate(values, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      <div className="space-y-1">
        <div className="relative">
          <Input
            type="email"
            placeholder="Enter email address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Please enter a valid email address",
              },
            })}
            className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        </div>
        {errors.email && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
};

export default ForgetPswForm;
