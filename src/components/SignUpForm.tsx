"use client";
import { useAuth } from "@/contexts/auth.context";
import { SignUpInput } from "@/interfaces/auth.interface";
import { Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";

const SignUpForm = () => {
  const { loading, signup } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState<SignUpInput>({
    email: "",
    password: "",
    fullname: "",
    phonenumber: "",
  });

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

  const isNameValid = useMemo(() => {
    if (input.fullname === "") return false;
  }, [input.fullname]);

  const isPhoneValid = useMemo(() => {
    if (input.phonenumber === "") return false;
  }, [input.phonenumber]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !input.email ||
      !input.password ||
      !input.fullname ||
      !input.phonenumber
    ) {
      alert("All fields are required");
      return;
    }

    await signup(input);
    setInput({
      email: "",
      password: "",
      fullname: "",
      phonenumber: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="input-group mb-3">
        <Input
          type="text"
          variant="underlined"
          label="Fullname"
          name="name"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          color={isNameValid ? "danger" : "success"}
          value={input?.fullname}
          onChange={(e) => setInput({ ...input, fullname: e.target.value })}
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
      <div className="input-group mb-3">
        <Input
          type="text"
          variant="underlined"
          label="Phone"
          name="phone"
          size="lg"
          className="w-full"
          classNames={{
            label: "text-black/50 dark:text-white/90",
          }}
          color={isPhoneValid ? "danger" : "success"}
          value={input?.phonenumber}
          onChange={(e) => setInput({ ...input, phonenumber: e.target.value })}
        />
      </div>
      <button className="w-full bg-primary text-white py-2 px-8 mt-8">
        {loading ? "Loading..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
