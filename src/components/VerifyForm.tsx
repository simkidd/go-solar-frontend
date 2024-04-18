"use client";
/* eslint-disable react/no-unescaped-entities */
import { axiosInstance } from "@/lib/axios";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const VerifyForm: React.FC<{ token: string }> = ({ token }) => {
  const [input, setInput] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [resend, setResend] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.post(`/auth/verify-user/${token}`);
        if (data) {
          setSuccess(true);
        }
      } catch (error) {
        const errorMsg = error as any;
        setError(true);
        console.log(errorMsg?.response.data.message);
      } finally {
        setLoading(false);
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
    try {
      setLoadingOtp(true);
      const { data } = await axiosInstance.post(
        "/auth/request-verification",
        input
      );
      console.log(data);
      // const res = data;
      // if (res) {
      //   setInput({ email: "" });
      //   setResend(true);
      // } else {
      //   setResend(false);
      // }
    } catch (error) {
      const errorMsg = error as any;
      console.log(errorMsg?.response.data.message);
    } finally {
      setLoadingOtp(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <h3 className="font-medium text-xl">Verifying...</h3>
        <p>This won't take long.</p>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="login-form-container gap-2 pe-md-5">
        {!showInput ? (
          <>
            <p className="text-center mb-4 text-red-400">
              Invalid or expired verification code
            </p>
            {/* <p className="text-primary text-center cursor-pointer" onClick={() => setShowInput(true)}>
              Resend verification
            </p> */}
          </>
        ) : (
          <>
            {resend ? (
              <p>We've sent a verification link to your email.</p>
            ) : (
              <>
                <h4 className="mb-2 text-center text-xl font-semibold">
                  Request verification
                </h4>
                <form onSubmit={handleSubmit} className="mb-8">
                  <div className="input-group mb-3">
                    <Input
                      type="email"
                      variant="underlined"
                      label="Email"
                      size="lg"
                      className="w-full"
                      classNames={{
                        label: "text-black/50 dark:text-white/90",
                      }}
                      errorMessage={
                        isEmailInvalid && "Please enter a valid email address"
                      }
                      value={input?.email}
                      onChange={(e) =>
                        setInput({ ...input, email: e.target.value })
                      }
                    />
                  </div>

                  <button className="w-full bg-primary text-white py-2 px-8 mt-8">
                    {loadingOtp ? "Sending..." : "Resend"}
                  </button>
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
