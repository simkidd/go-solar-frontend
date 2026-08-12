"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useResendVerificationMutation } from "@/hooks/mutations/useAuthMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/custom/Spinner";
import { MailIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";

const VerifyForm: React.FC<{ token: string }> = ({ token }) => {
  const resendMutation = useResendVerificationMutation();
  const [input, setInput] = useState({
    email: "",
  });
  const [loadingVerify, setLoadingVerify] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [resend] = useState(false);
  const [showInput] = useState(false);

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
        console.log(errorMsg?.response?.data?.message);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resendMutation.mutate(input, {
      onSuccess: () => setInput({ email: "" }),
    });
  };

  if (loadingVerify) {
    return (
      <div className="text-center py-8 space-y-3 font-inter">
        <Spinner size="lg" />
        <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">Verifying your account...</h3>
        <p className="text-xs text-zinc-400">
          This won't take long. Please do not close this window.
        </p>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="space-y-6 font-inter">
        {!showInput ? (
          <div className="flex flex-col items-center text-center space-y-4">
            <XCircleIcon size={56} className="text-rose-500" />
            <p className="text-sm font-bold text-rose-500">
              Invalid or expired verification link
            </p>
          </div>
        ) : (
          <>
            {resend ? (
              <p className="text-sm text-zinc-500">We've sent a verification link to your email.</p>
            ) : (
              <div className="space-y-4">
                <h4 className="text-center text-base font-bold text-zinc-900 dark:text-white">
                  Request Verification Link
                </h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl"
                      value={input?.email}
                      onChange={(e) =>
                        setInput({ ...input, email: e.target.value })
                      }
                    />
                    <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                  </div>

                  {isEmailInvalid && (
                    <p className="text-[11px] text-rose-500 font-semibold pl-1">Please enter a valid email address</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11"
                    disabled={!input.email || resendMutation.isPending}
                  >
                    {resendMutation.isPending ? "Sending..." : "Resend Link"}
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4 font-inter py-6">
        <h3 className="font-extrabold text-xl text-zinc-900 dark:text-white">You're all set!</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">Thank you for verifying your email address. You can now login to your account.</p>
        <Link href="/account/login" className="block pt-2">
          <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-8">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};

export default VerifyForm;
