"use client";
import React, { useMemo, useState } from "react";
import { SignUpInput } from "@/interfaces/auth.interface";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockIcon, MailIcon, User2Icon } from "lucide-react";
import { toast } from "sonner";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

const SignUpForm = () => {
  const { loading, signup } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [input, setInput] = useState<SignUpInput>({
    email: "",
    password: "",
    fullname: "",
    phonenumber: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });

  input.fullname = input.firstName + " " + input.lastName;

  const validateEmail = (input: string) =>
    input.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (input.email === "") return false;

    return validateEmail(input.email) ? false : true;
  }, [input.email]);

  const passwordErrors = useMemo(() => {
    const errors: string[] = [];
    if (input.password === "") return errors;

    if (input.password.length < 6) {
      errors.push("Password must be 6 characters or more.");
    }
    if (!/[A-Z]/.test(input.password)) {
      errors.push("Password must include at least 1 upper case letter");
    }
    if (!/[^a-z0-9]/i.test(input.password)) {
      errors.push("Password must include at least 1 symbol.");
    }
    return errors;
  }, [input.password]);

  const isPasswordInvalid = passwordErrors.length > 0;

  const isConfirmPasswordInvalid = useMemo(() => {
    if (input.confirmPassword === "") return false;
    return input.password !== input.confirmPassword;
  }, [input.password, input.confirmPassword]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !input.email ||
      !input.password ||
      !input.fullname ||
      !input.phonenumber ||
      !input.firstName ||
      !input.lastName ||
      !input.confirmPassword
    ) {
      toast.warning("All fields are required");
      return;
    }

    if (isEmailInvalid || isPasswordInvalid || isConfirmPasswordInvalid) {
      toast.warning("Please fix the validation errors");
      return;
    }

    await signup(input);

    setInput({
      email: "",
      password: "",
      fullname: "",
      phonenumber: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    });
  };

  const isFormDisabled =
    loading ||
    !input.email ||
    !input.password ||
    !input.phonenumber ||
    !input.firstName ||
    !input.lastName ||
    !input.confirmPassword ||
    isEmailInvalid ||
    isPasswordInvalid ||
    isConfirmPasswordInvalid;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-inter">
      
      {/* First/Last name inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="First Name"
            name="firstName"
            className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
            value={input?.firstName}
            onChange={(e) => setInput({ ...input, firstName: e.target.value })}
            required
          />
          <User2Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Last Name"
            name="lastName"
            className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
            value={input?.lastName}
            onChange={(e) => setInput({ ...input, lastName: e.target.value })}
            required
          />
          <User2Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Email input */}
      <div className="relative">
        <Input
          type="email"
          placeholder="Email Address"
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

      {/* Phone input */}
      <div>
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry="NG"
          placeholder="Enter phone number"
          value={input?.phonenumber}
          onChange={(value) => setInput({ ...input, phonenumber: value || "" })}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl h-11 px-3 text-xs focus-within:ring-2 focus-within:ring-emerald-500 [&>input]:bg-transparent [&>input]:px-2 [&>input]:outline-0 [&>input]:h-full [&>input]:text-zinc-800 dark:[&>input]:text-white [&>input]:text-xs font-semibold"
        />
      </div>

      {/* Password inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Password */}
        <div className="relative">
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="Password"
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

        {/* Confirm password */}
        <div className="relative">
          <Input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            className="w-full h-11 pl-10 pr-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
            value={input?.confirmPassword}
            onChange={(e) =>
              setInput({ ...input, confirmPassword: e.target.value })
            }
            required
          />
          <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
            type="button"
            onClick={toggleConfirmPasswordVisibility}
          >
            {confirmPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

      </div>

      {isPasswordInvalid && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 p-3 rounded-xl text-rose-600 dark:text-rose-450 text-[11px] leading-relaxed pl-6">
          <ul className="list-disc space-y-0.5">
            {passwordErrors.map((error, i) => (
              <li key={i} className="font-semibold">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {isConfirmPasswordInvalid && (
        <p className="text-[11px] text-rose-500 font-semibold pl-1">Passwords do not match</p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11"
        disabled={isFormDisabled}
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>

    </form>
  );
};

export default SignUpForm;
