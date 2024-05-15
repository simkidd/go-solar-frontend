"use client";
import { LoginInput } from "@/interfaces/auth.interface";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const LoginForm = () => {
  const { login } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    login(input)
      .then((res) => {
        if (!res?._id) return;
        else if (res?.isAdmin || res?.isSuperAdmin) {
          router.push("/admin");
        } else router.push("/");
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
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
      <button
        className="w-full bg-primary text-white py-2 px-8 mt-8 disabled:bg-gray-400"
        disabled={!input.password || isPasswordInvalid}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
