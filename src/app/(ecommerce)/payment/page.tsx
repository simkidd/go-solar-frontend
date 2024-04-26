"use client";
import useCartStore from "@/lib/stores/useCart";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentPage = () => {
  const { deliveryDetails, setPaymentMethod } = useCartStore();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    if (!deliveryDetails.streetAddress) {
      router.push("/shipping");
      return;
    }
  }, [router, deliveryDetails]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPaymentMethod) {
      setPaymentMethod(selectedPaymentMethod);
      router.push("/placeorder");
    }
  };

  const paymentType = [
    { name: "Paystack", value: "paystack" },
    // { name: "Cash on delivery", value: "cashOnDelivery" },
  ];

  return (
    <div className="container mx-auto px-2 py-16">
      <div className="max-w-[600px] mx-auto">
        <CheckoutSteps activeStep={1} />
        <form onSubmit={handlePayment}>
          <h2 className="text-3xl font-bold mb-8">Payment Method</h2>
          {paymentType.map((payment) => (
            <div key={payment.value} className="mb-4">
              <input
                name="paymentMethod"
                className="p-2 outline-none focus:ring-0"
                id={payment.value}
                type="radio"
                value={payment.value}
                checked={selectedPaymentMethod === payment.value}
                onChange={() => setSelectedPaymentMethod(payment.value)}
              />

              <label className="p-2" htmlFor={payment.value}>
                {payment.value}
              </label>
            </div>
          ))}

          <button
            type="submit"
            className="bg-primary px-8 py-2 text-white rounded-md hover:bg-primary-dark transition duration-300"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
