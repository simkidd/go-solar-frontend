"use client";
import { CallbackResponse } from "@/interfaces/payment.interface";
import { useAuthStore } from "@/lib/stores/auth.store";
import useCartStore from "@/lib/stores/cart.store";
import { CircleX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { usePaystackPayment } from "react-paystack";

const Payment = () => {
  const { totalPricePaid, setPaymentData } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  const config = {
    reference: user?._id + "-" + Date.now(),
    email: user?.email,
    first_name: user?.firstname,
    last_name: user?.lastname,
    publicKey,
    amount: totalPricePaid * 100,
  };

  const onSuccess = (response: CallbackResponse) => {
    if (response.status === "success") {
      setPaymentData(JSON.stringify(response));
      router.push(`/confirm-order${response.redirecturl}`);
    } else {
      return;
    }
  };

  const onClose = () => {
    setErrorMsg("Your payment was unsuccessful, try again later!");
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <div>
      <button
        className="bg-primary text-white px-8 py-2"
        onClick={() => initializePayment({ onSuccess, onClose })}
      >
        Pay Now
      </button>

      {errorMsg && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="relative light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-lg p-8 max-w-[500px]">
            <div className="flex flex-col items-center">
              <CircleX size={60} className="text-red-600" />
              <p className="text-lg font-semibold my-4 text-center">
                {errorMsg}
              </p>
              <button
                className="border border-primary mt-2 text-primary px-4 py-2 rounded-md"
                onClick={() => setErrorMsg("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
