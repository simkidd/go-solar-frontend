"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useResendVerificationMutation } from "@/hooks/mutations/useAuthMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/custom/Spinner";
import { MailIcon, XCircleIcon, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const VerifyForm: React.FC<{ token: string }> = ({ token }) => {
  const resendMutation = useResendVerificationMutation();
  const [input, setInput] = useState({
    email: "",
  });
  const [loadingVerify, setLoadingVerify] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

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
    input.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (input.email === "") return false;

    return validateEmail(input.email) ? false : true;
  }, [input.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resendMutation.mutate(input, {
      onSuccess: () => {
        setInput({ email: "" });
        setShowInputForm(false);
      },
    });
  };

  if (loadingVerify) {
    return (
      <div className="text-center py-8 space-y-4 font-inter animate-pulse">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">Verifying account</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Please keep this window open while we secure and activate your solar access portal.
          </p>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="space-y-6 font-inter py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!showInputForm ? (
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20 flex items-center justify-center">
              <XCircleIcon className="w-8 h-8 text-rose-500" strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Verification Failed</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                This verification link is invalid, expired, or has already been used.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full pt-2">
              <Button
                onClick={() => setShowInputForm(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs uppercase tracking-wider h-11 rounded-xl cursor-pointer"
              >
                Request New Link
              </Button>
              <Link href="/auth/login" className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors py-2">
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1 text-center">
              <h4 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
                New Verification Link
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                Enter your account email below to receive a new activation link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={input.email}
                    onChange={(e) => setInput({ ...input, email: e.target.value })}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    className="w-full h-11 pl-10 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-250 bg-zinc-50/50 dark:bg-zinc-950/20"
                  />
                  <MailIcon 
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-250 pointer-events-none ${
                      isEmailFocused ? "text-primary" : "text-zinc-400"
                    }`} 
                  />
                </div>
                {isEmailInvalid && (
                  <p className="text-[11px] text-rose-500 font-semibold pl-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInputForm(false)}
                  className="flex-1 h-11 rounded-xl text-xs font-bold border-zinc-200 dark:border-zinc-850"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!input.email || isEmailInvalid || resendMutation.isPending}
                  className="flex-[2] bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 shadow-md shadow-emerald-550/10 cursor-pointer"
                >
                  {resendMutation.isPending ? "Sending..." : "Send Link"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-6 font-inter py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#08AA08]/10 border border-[#08AA08]/20 flex items-center justify-center mx-auto relative">
          <CheckCircle2 className="w-8 h-8 text-[#08AA08]" strokeWidth={1.5} />
          <div className="absolute inset-0 rounded-2xl border border-[#08AA08]/20 animate-ping opacity-30" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-extrabold text-xl text-zinc-900 dark:text-white tracking-tight">Account Verified!</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
            Thank you for verifying your email address. Your account is fully active and ready to go.
          </p>
        </div>

        <Link href="/auth/login" className="block pt-2">
          <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 shadow-md shadow-emerald-550/10 transition-all active:scale-[0.985] cursor-pointer">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};

export default VerifyForm;
