/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState, Suspense } from "react";
import {
  CheckIcon,
  XCircle,
  Loader2,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import useCartStore from "@/lib/stores/cart.store";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const OrderSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const reference = searchParams.get("reference");
  const [verifying, setVerifying] = useState(!!reference);
  const [status, setStatus] = useState<"success" | "error" | "default">(
    "default",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) return;

      try {
        setVerifying(true);
        const { data } = await axiosInstance.post(
          "/users/orders/verify-payment",
          {
            paymentReference: reference,
          },
        );

        if (data.success) {
          clearCart();
          setStatus("success");
          toast.success("Payment verified and order finalized!");
        } else {
          setStatus("error");
          setErrorMsg("Payment verification failed.");
        }
      } catch (error: any) {
        setStatus("error");
        const errMsg =
          error?.response?.data?.message ||
          "Verification failed. Please contact support.";
        setErrorMsg(errMsg);
        toast.error(errMsg);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [reference, clearCart]);

  const handleCopyReference = () => {
    if (!reference) return;
    navigator.clipboard.writeText(reference);
    setCopied(true);
    toast.success("Reference copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // State: Verifying Payment
  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 bg-zinc-50/50 dark:bg-zinc-950/20">
        <div className="relative w-full max-w-md p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl shadow-xl backdrop-blur-sm text-center space-y-6">
          <div className="absolute inset-x-0 -top-12 flex justify-center">
            <div className="h-24 w-24 bg-gradient-to-tr from-[#08AA08] to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          </div>
          <div className="pt-10 space-y-2">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Verifying Payment
            </h2>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed px-4">
              We are securely finalizing your transaction details with Paystack.
              Please do not reload or close this page.
            </p>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#08AA08] rounded-full animate-[loading_1.5s_ease-in-out_infinite] w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  // State: Payment Error
  if (status === "error" || errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 bg-zinc-50/50 dark:bg-zinc-950/20">
        <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl shadow-xl text-center space-y-6">
          <div className="h-16 w-16 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
            <XCircle size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Verification Failed
            </h2>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed px-4">
              {errorMsg ||
                "We couldn't confirm your transaction. If money was debited, please contact support with the reference code below."}
            </p>
          </div>

          {reference && (
            <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-2xl">
              <span className="font-mono text-xs text-zinc-650 dark:text-zinc-400 truncate max-w-[220px]">
                {reference}
              </span>
              <button
                onClick={handleCopyReference}
                className="text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-[#08AA08]" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => router.push("/shop")}
              className="w-full bg-[#08AA08] hover:bg-[#079907] active:scale-[0.98] transition-all text-white font-bold rounded-xl h-11 text-xs"
            >
              Return to Store
            </button>
            <button
              onClick={() => router.push("/account/orders")}
              className="w-full border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-[0.98] transition-all text-zinc-700 dark:text-zinc-300 font-bold rounded-xl h-11 text-xs"
            >
              View Your Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: Payment / Order Success
  return (
    <div className="min-h-screen bg-zinc-50/30 dark:bg-zinc-950/20 py-16 px-4 font-inter">
      <div className="max-w-2xl mx-auto">
        {/* Glow effect backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-[32px] shadow-2xl p-8 md:p-12 relative overflow-hidden space-y-8">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-ping opacity-75" />
              <div className="h-16 w-16 bg-gradient-to-tr from-[#08AA08] to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 relative z-10">
                <CheckIcon className="h-8 w-8 text-white stroke-[3px]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Order Confirmed!
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
                Thank you for your order. Your clean energy transformation is
                officially underway. A receipt has been sent to your email.
              </p>
            </div>
          </div>

          {/* Reference and Delivery Details Card */}
          {reference && (
            <div className="bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Order Reference
                </p>
                <p className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 select-all truncate max-w-[280px]">
                  {reference}
                </p>
              </div>
              <button
                onClick={handleCopyReference}
                className="shrink-0 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-350 hover:text-zinc-900 dark:hover:text-white font-bold text-xs h-9.5 px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.97]"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-[#08AA08]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy Code"}
              </button>
            </div>
          )}

          {/* Next Steps Stepper */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight">
              What's Next?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-100/40 dark:border-emerald-900/10 p-4 rounded-2xl relative space-y-2">
                <span className="text-[10px] font-bold text-[#08AA08] bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Step 1
                </span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  Order Confirmed
                </h4>
                <p className="text-[10px] text-zinc-550 dark:text-zinc-400 leading-relaxed">
                  Your payment has been cleared, and your order details are
                  dispatched to our processing center.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  Step 2
                </span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  Shipment & Delivery
                </h4>
                <p className="text-[10px] text-zinc-550 dark:text-zinc-400 leading-relaxed">
                  Our dispatch logistics will ship your hardware. Delivery
                  typically takes 4-5 working days.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  Step 3
                </span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  Free Installation
                </h4>
                <p className="text-[10px] text-zinc-550 dark:text-zinc-400 leading-relaxed">
                  Our certified engineer team will contact you to schedule your
                  system mounting and grid optimization.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
            <button
              onClick={() => router.push("/account/orders")}
              className="w-full sm:flex-1 bg-[#08AA08] hover:bg-[#079907] text-white font-bold rounded-2xl h-12 text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all hover:translate-y-[-1px] active:translate-y-[0px] active:scale-[0.99]"
            >
              Track Orders
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => router.push("/shop")}
              className="w-full sm:w-auto px-6 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl h-12 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderSuccess = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccess;
