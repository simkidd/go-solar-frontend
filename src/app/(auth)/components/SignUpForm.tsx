"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockIcon, MailIcon, User2Icon } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSignUpMutation } from "@/hooks/mutations/useAuthMutations";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phonenumber: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = () => {
  const signupMutation = useSignUpMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phonenumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = (values: FormValues) => {
    signupMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      fullname: `${values.firstName} ${values.lastName}`.trim(),
      email: values.email,
      phonenumber: values.phonenumber,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="relative">
            <Input
              placeholder="First Name"
              {...register("firstName", { required: "First name is required" })}
              className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
            />
            <User2Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>
          {errors.firstName && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Input
              placeholder="Last Name"
              {...register("lastName", { required: "Last name is required" })}
              className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
            />
            <User2Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>
          {errors.lastName && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email input */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type="email"
            placeholder="Email Address"
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

      {/* Phone input */}
      <div className="space-y-1">
        <Controller
          control={control}
          name="phonenumber"
          rules={{
            required: "Phone number is required",
            validate: (value) =>
              (value && isValidPhoneNumber(value)) || "Invalid phone number",
          }}
          render={({ field }) => (
            <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 bg-white dark:bg-zinc-900 flex items-center">
              <PhoneInput
                placeholder="Phone number"
                defaultCountry="NG"
                value={field.value}
                onChange={field.onChange}
                className="w-full text-xs font-semibold focus:outline-none"
              />
            </div>
          )}
        />
        {errors.phonenumber && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.phonenumber.message}
          </p>
        )}
      </div>

      {/* Password input */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="Password"
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

      {/* Confirm password input */}
      <div className="space-y-1">
        <div className="relative">
          <Input
            type={confirmVisible ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => val === password || "Passwords do not match",
            })}
            className="w-full h-11 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
            type="button"
            onClick={() => setConfirmVisible(!confirmVisible)}
          >
            {confirmVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 mt-2"
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};

export default SignUpForm;
