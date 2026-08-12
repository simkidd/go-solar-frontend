"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountPassordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = (values: FormValues) => {
    toast.success("Password updated successfully!");
    reset();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs rounded-2xl p-6 font-inter">
      <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Current Password <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            placeholder="Enter current password"
            {...register("currentPassword", { required: "Current password is required" })}
            className="border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          {errors.currentPassword && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            New Password <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            placeholder="Enter new password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            className="border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          {errors.newPassword && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            placeholder="Confirm new password"
            {...register("confirmPassword", {
              required: "Please confirm new password",
              validate: (val) => val === newPassword || "Passwords do not match",
            })}
            className="border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          {errors.confirmPassword && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6"
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountPassordForm;
