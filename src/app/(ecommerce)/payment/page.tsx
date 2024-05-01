"use client";
import useCartStore from "@/lib/stores/cart.store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import PayImage from "@/assets/paystack.png";
import { useAuth } from "@/contexts/auth.context";

const PaymentPage = () => {
  const { currentUser } = useAuth();
  const { deliveryDetails, setPaymentMethod } = useCartStore();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/login");
      return;
    } else if (!deliveryDetails.streetAddress) {
      router.push("/shipping");
      return;
    }
  }, [router, deliveryDetails, currentUser]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPaymentMethod) {
      setPaymentMethod(selectedPaymentMethod);
      router.push("/placeorder");
    }
  };

  const paymentType = [
    { name: "Paystack", value: "paystack", img: PayImage.src },
    // { name: "Cash on delivery", value: "cashOnDelivery" },
  ];

  return (
    <div className="container mx-auto px-2 py-16">
      <div className="max-w-[600px] mx-auto">
        <CheckoutSteps activeStep={1} />
        <form onSubmit={handlePayment}>
          <h2 className="text-3xl font-bold mb-8">Payment Method</h2>
          {paymentType.map((payment) => (
            <div key={payment.value} className="mb-4 flex">
              <input
                name="paymentMethod"
                className="p-2 outline-none focus:ring-0"
                id={payment.value}
                type="radio"
                value={payment.value}
                checked={selectedPaymentMethod === payment.value}
                onChange={() => setSelectedPaymentMethod(payment.value)}
              />

              <label htmlFor={payment.value} className="ml-2">
                <div className="px-2 h-10 w-28 cursor-pointer bg-white rounded">
                  <img
                    src={payment?.img}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </label>
            </div>
          ))}

          <button
            type="submit"
            className="bg-primary px-8 py-2 text-white rounded-md hover:bg-primary-dark transition duration-300 disabled:bg-gray-400"
            disabled={!selectedPaymentMethod}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
