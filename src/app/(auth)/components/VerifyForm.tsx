"use client";
/* eslint-disable react/no-unescaped-entities */
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button, Input, Spinner } from "@heroui/react";
import { MailIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const VerifyForm: React.FC<{ token: string }> = ({ token }) => {
  const { loading, resendVerification } = useAuthStore();
  const [input, setInput] = useState({
    email: "",
  });
  const [loadingVerify, setLoadingVerify] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [resend, setResend] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingVerify(true);
        const { data } = await axiosInstance.post(`/auth/verify-user/${token}`);
        if (data) {
          setSuccess(true);
        }
      } catch (error) {
        const errorMsg = error as any;
        setError(true);
        console.log(errorMsg?.response.data.message);
      } finally {
        setLoadingVerify(false);
      }
    })();
  }, [token]);

  const validateEmail = (input: string) =>
    input.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (input.email === "") return false;

    return validateEmail(input.email) ? false : true;
  }, [input.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await resendVerification(input);
    setInput({ email: "" });
  };

  if (loadingVerify) {
    return (
      <div className="text-center py-4">
        <Spinner size="lg" />
        <h3 className="font-medium text-xl mt-3">Verifying...</h3>
        <p className="text-gray-500 dark:text-gray-500">
          This won't take long.
        </p>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="login-form-container gap-2 pe-md-5">
        {!showInput ? (
          <div className="flex flex-col items-center gap-4">
          <XCircleIcon size={50} className="text-center text-red-400" />
            <p className="text-center mb-4 text-red-400">
              Invalid or expired verification code
            </p>
            {/* <p
              className="text-primary text-center cursor-pointer"
              onClick={() => setShowInput(true)}
            >
              Resend verification
            </p> */}
          </div>
        ) : (
          <>
            {resend ? (
              <p>We've sent a verification link to your email.</p>
            ) : (
              <>
                <h4 className="mb-4 text-center text-xl font-semibold">
                  Request verification
                </h4>
                <form onSubmit={handleSubmit} className="mb-8">
                  <div className="input-group mb-3">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full"
                      startContent={
                        <MailIcon
                          size={16}
                          className="text-default-400 pointer-events-none flex-shrink-0"
                        />
                      }
                      errorMessage={
                        isEmailInvalid && "Please enter a valid email address"
                      }
                      value={input?.email}
                      onChange={(e) =>
                        setInput({ ...input, email: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    isLoading={loading}
                    className="w-full bg-primary text-white py-2 px-8 mt-8 disabled:!bg-gray-400"
                    disabled={!input.email || loading}
                  >
                    Resend
                  </Button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="font-medium text-xl">You're all set!</h3>
        <p>Thank you for verifying your email.</p>
        <Link href="/account/login" className="text-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return null;
};

export default VerifyForm;
