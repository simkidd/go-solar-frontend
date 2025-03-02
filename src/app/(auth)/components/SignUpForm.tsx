"use client";
import { SignUpInput } from "@/interfaces/auth.interface";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button, Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

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

  const validatePassword = (input: string) => input.length >= 6;

  const isPasswordInvalid = useMemo(() => {
    if (input.password === "") return false;
    return !validatePassword(input.password);
  }, [input.password]);

  const isFirstNameValid = useMemo(() => {
    if (input.firstName === "") return false;
  }, [input.firstName]);

  const isLastNameValid = useMemo(() => {
    if (input.lastName === "") return false;
  }, [input.lastName]);

  const validatePhoneNumber = (input: string) => input.match(/^[0-9]{10,15}$/);

  const isPhoneInvalid = useMemo(() => {
    if (input.phonenumber === "") return false;
    return !validatePhoneNumber(input.phonenumber);
  }, [input.phonenumber]);

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

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="input-group mb-3">
        <Input
          type="text"
          variant="underlined"
          label="First Name"
          name="firstName"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          color={isFirstNameValid ? "danger" : "success"}
          value={input?.firstName}
          onChange={(e) => setInput({ ...input, firstName: e.target.value })}
        />
      </div>
      <div className="input-group mb-3">
        <Input
          type="text"
          variant="underlined"
          label="Last Name"
          name="lastName"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          color={isLastNameValid ? "danger" : "success"}
          value={input?.lastName}
          onChange={(e) => setInput({ ...input, lastName: e.target.value })}
        />
      </div>
      <div className="input-group mb-3">
        <Input
          type="email"
          variant="underlined"
          label="Email"
          name="email"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          color={isEmailInvalid ? "danger" : "success"}
          errorMessage={isEmailInvalid && "Please enter a valid email address"}
          value={input?.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
        />
      </div>
      <div className="input-group mb-3">
        <Input
          type="number"
          variant="underlined"
          label="Phone"
          name="phone"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          color={isPhoneInvalid ? "danger" : "success"}
          errorMessage={isPhoneInvalid && "Please enter a valid phone number"}
          value={input?.phonenumber}
          onChange={(e) => setInput({ ...input, phonenumber: e.target.value })}
        />
      </div>
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
      <div className="input-group mb-4">
        <Input
          type={confirmPasswordVisible ? "text" : "password"}
          variant="underlined"
          label="Confirm Password"
          name="confirmPassword"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? (
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
          color={isConfirmPasswordInvalid ? "danger" : "success"}
          errorMessage={isConfirmPasswordInvalid && "Passwords do not match"}
          value={input?.confirmPassword}
          onChange={(e) =>
            setInput({ ...input, confirmPassword: e.target.value })
          }
        />
      </div>

      <Button
        variant="solid"
        color="primary"
        type="submit"
        className="w-full rounded-none disabled:!bg-gray-400 mt-4"
        isLoading={loading}
        isDisabled={!input.password || isPasswordInvalid || loading}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;
