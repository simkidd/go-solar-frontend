"use client";
import { useAuth } from "@/contexts/auth.context";
import { CreateOrderInput } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import useCartStore from "@/lib/stores/useCart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";

const Payment = () => {
  const {
    totalPricePaid,
    setPaymentReference,
    deliveryDetails,
    paymentMethod,
    paymentReference,
    cartItems,
    setPaymentData,
    paymentData,
  } = useCartStore();
  const { currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const publicKey =
    process.env.PAYSTACK_SECRET_KEY ||
    "pk_test_09d2e45c3e030135d9544dd30f3b98c65205a60c";

  console.log("key:", publicKey);

  const config = {
    reference: new Date().getTime().toString(),
    email: currentUser?.email,
    publicKey,
    amount: totalPricePaid * 100,
  };

  const onSuccess = (reference: any) => {
    const params = new URLSearchParams(searchParams);
    setPaymentReference(reference.reference);
    setPaymentData(JSON.stringify(reference));

    if (reference) {
      params.set("ref", reference.reference);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onClose = () => {
    toast.error("Your payment was unsuccessful, try again later!");
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <div>
      <button
        className="bg-blue-400"
        onClick={() => initializePayment({ onSuccess, onClose })}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
