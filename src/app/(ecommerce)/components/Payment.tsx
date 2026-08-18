"use client";
import React, { useState } from "react";
import { CallbackResponse } from "@/interfaces/payment.interface";
import {
  CreateOrderInput,
  DeliveryDetails,
} from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import useCartStore from "@/lib/stores/cart.store";
import { Spinner } from "@/components/custom/Spinner";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const {
    cartItems,
    deliveryDetails,
    paymentMethod,
    setPaymentData,
    setDeliveryDetails,
    setTotalPricePaid,
    setPaymentMethod,
    totalPricePaid,
    paymentData,
    clearCart,
  } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  const input: CreateOrderInput = {
    products: cartItems.map(({ deliveryFee, product, qty }) => ({
      product: product?._id,
      qty,
      deliveryFee,
    })),
    deliveryDetails,
    totalPricePaid,
    paymentMethod,
    paymentReference: "",
    paymentData,
  };

  const config = {
    reference: user?._id + "-" + Date.now(),
    email: user?.email,
    first_name: user?.firstname,
    last_name: user?.lastname,
    publicKey,
    amount: totalPricePaid * 100,
  };

  const onSuccess = (response: CallbackResponse) => {
    if (response.status === "success" && response?.reference) {
      const paymentdata = JSON.stringify(response);

      input.paymentReference = response?.reference;
      input.paymentData = paymentdata;

      const createOrder = async () => {
        try {
          setLoading(true);
          const { data } = await axiosInstance.post(
            "/users/orders/create-order",
            input
          );

          if (data.success) {
            clearCart();
            setDeliveryDetails({} as DeliveryDetails);
            setTotalPricePaid(0);
            setPaymentMethod("");
            setPaymentData("");

            router.push('/orders/success')
          }
        } catch (error: any) {
          console.log(error?.response?.data.message);
          setError(error?.response?.data.message);
        } finally {
          setLoading(false);
        }
      };

      createOrder();
    }
  };

  const onClose = () => {
    setErrorMsg("Your payment was unsuccessful, try again later!");
  };

  const initializePayment = usePaystackPayment(config);

  if (loading) {
    return (
      <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 font-inter">
        <div className="relative bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <Spinner size="lg" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Processing Order...</h2>
            <p className="text-xs text-zinc-400">Please do not refresh the page while we authenticate your transaction.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 font-inter">
        <div className="relative bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <CircleX size={56} className="text-rose-500" />
            <p className="text-sm font-bold text-zinc-900 dark:text-white">{error}</p>
            <Button onClick={() => router.push("/payment")} className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter">
      <Button
        className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-11 px-8"
        onClick={() => initializePayment({ onSuccess, onClose })}
      >
        Proceed to Payment
      </Button>

      {errorMsg && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="relative bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <CircleX size={56} className="text-rose-500" />
              <p className="text-sm font-bold text-zinc-900 dark:text-white">{errorMsg}</p>
              <Button
                className="w-full bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl font-bold text-xs uppercase"
                onClick={() => setErrorMsg("")}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
