"use client";
import { SignUpInput } from "@/interfaces/auth.interface";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button, Input } from "@heroui/react";
import { Eye, EyeOff, LockIcon, MailIcon, User2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
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

  const errors: string[] = [];

  input.fullname = input.firstName + " " + input.lastName;

  const validateEmail = (input: string) =>
    input.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (input.email === "") return false;

    return validateEmail(input.email) ? false : true;
  }, [input.email]);

  const validatePassword = (input: string) => {
    const hasUpperCase = /[A-Z]/.test(input);
    const hasSymbol = /[^a-z0-9]/i.test(input);
    const hasMinLength = input.length >= 6;
    return hasUpperCase && hasSymbol && hasMinLength;
  };

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

  const isFirstNameValid = useMemo(() => {
    if (input.firstName === "") return false;
    return input.firstName && input.firstName.length > 0;
  }, [input.firstName]);

  const isLastNameValid = useMemo(() => {
    if (input.lastName === "") return false;
    return input.lastName && input.lastName.length > 0;
  }, [input.lastName]);

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

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 mb-4 gap-3">
        <div className="input-group">
          <Input
            type="text"
            placeholder="First Name"
            labelPlacement="outside"
            name="firstName"
            className="w-full"
            value={input?.firstName}
            onChange={(e) => setInput({ ...input, firstName: e.target.value })}
            startContent={
              <User2Icon
                size={16}
                className="text-default-400 pointer-events-none flex-shrink-0"
              />
            }
            classNames={{
              inputWrapper:
                "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
            }}
          />
        </div>
        <div className="input-group">
          <Input
            type="text"
            placeholder="Last Name"
            labelPlacement="outside"
            name="lastName"
            className="w-full"
            value={input?.lastName}
            onChange={(e) => setInput({ ...input, lastName: e.target.value })}
            startContent={
              <User2Icon
                size={16}
                className="text-default-400 pointer-events-none flex-shrink-0"
              />
            }
            classNames={{
              inputWrapper:
                "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
            }}
          />
        </div>
      </div>

      <div className="input-group mb-4">
        <Input
          type="email"
          placeholder="Email"
          name="email"
          className="w-full"
          labelPlacement="outside"
          errorMessage={isEmailInvalid && "Please enter a valid email address"}
          value={input?.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          startContent={
            <MailIcon
              size={16}
              className="text-default-400 pointer-events-none flex-shrink-0"
            />
          }
          classNames={{
            inputWrapper:
              "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
          }}
        />
      </div>
      <div className="input-group mb-4">
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry="NG"
          placeholder="Enter phone number"
          value={input?.phonenumber}
          onChange={(value) => setInput({ ...input, phonenumber: value || "" })}
          error={
            input?.phonenumber
              ? isValidPhoneNumber(input?.phonenumber)
                ? undefined
                : "Invalid phone number"
              : "Phone number required"
          }
          className="bg-[#f4f4f5] rounded-[12px] h-10 px-3 text-sm focus:outline-none [&>input]:bg-transparent [&>input]:px-1 [&>input]:outline-0 [&>input]:h-full [&>input]:text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mb-4 gap-3">
        <div className="input-group">
          <Input
            type={isVisible ? "text" : "password"}
            placeholder="Password"
            name="password"
            className="w-full"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
            }}
            startContent={
              <LockIcon
                size={16}
                className="text-default-400 pointer-events-none flex-shrink-0"
              />
            }
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
            isInvalid={isPasswordInvalid}
            errorMessage={
              isPasswordInvalid && (
                <ul className="list-disc pl-4">
                  {passwordErrors.map((error, i) => (
                    <li key={i} className="text-xs">
                      {error}
                    </li>
                  ))}
                </ul>
              )
            }
            value={input?.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />
        </div>
        <div className="input-group">
          <Input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            className="w-full"
            labelPlacement="outside"
            startContent={
              <LockIcon
                size={16}
                className="text-default-400 pointer-events-none flex-shrink-0"
              />
            }
            classNames={{
              inputWrapper:
                "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
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
            isInvalid={isConfirmPasswordInvalid}
            errorMessage={isConfirmPasswordInvalid && "Passwords do not match"}
            value={input?.confirmPassword}
            onChange={(e) =>
              setInput({ ...input, confirmPassword: e.target.value })
            }
          />
        </div>
      </div>

      <Button
        variant="solid"
        color="primary"
        type="submit"
        className="w-full disabled:!bg-gray-400 mt-4 data-[focus-visible=true]:outline-primary"
        isLoading={loading}
        isDisabled={
          loading ||
          !input.email ||
          !input.password ||
          !input.phonenumber ||
          !input.firstName ||
          !input.lastName ||
          !input.confirmPassword ||
          isEmailInvalid ||
          isPasswordInvalid ||
          isConfirmPasswordInvalid
        }
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;
