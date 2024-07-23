"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import useCartStore from "@/lib/stores/cart.store";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { BiCreditCard, BiWallet } from "react-icons/bi";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import StepButton from "./StepButtons";

interface PaymentType {
  name: string;
  value: string;
  icon: IconType | LucideIcon;
  disabled: boolean;
}

const paymentType: PaymentType[] = [
  {
    name: "Cash on delivery",
    value: "cashOnDelivery",
    icon: BiWallet,
    disabled: true,
  },
  {
    name: "Paystack",
    value: "paystack",
    icon: BiCreditCard,
    disabled: false,
  },
];

const PaymentMethod = () => {
  const { user } = useAuthStore();
  const { setPaymentMethod, setCurrentStep, paymentMethod, deliveryDetails } =
    useCartStore();
  const router = useRouter();
  const [input, setInput] = useState({
    paymentMethod: paymentMethod || "",
  });

  useEffect(() => {
    if (!user) {
      setCurrentStep(1);
      router.push("/account/login");
      return;
    } else if (!deliveryDetails.streetAddress) {
      setCurrentStep(1);
      return;
    }
  }, [router, deliveryDetails, user]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.paymentMethod) {
      setPaymentMethod(input.paymentMethod);
      setCurrentStep(3);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <h2 className="text-3xl font-bold mb-8">Payment Method</h2>
      <p className="mb-2">Select a payment method</p>
      <ul className="w-full mb-8">
        {paymentType.map((payment) => (
          <li key={payment.value} className="mb-4 flex">
            <input
              name="paymentMethod"
              className="hidden peer"
              id={payment.value}
              type="radio"
              value={payment.value}
              checked={input.paymentMethod === payment.value}
              onChange={() => setInput({ paymentMethod: payment.value })}
              required
              disabled={payment.disabled}
            />

            <label
              htmlFor={payment.value}
              className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-[#2A2B2F] dark:hover:bg-gray-700"
            >
              <div className="flex gap-2 items-center">
                <payment.icon size={24} />
                <p>{payment.name}</p>
              </div>

              <div className="flex items-center">
                {payment.disabled && (
                  <span className="text-sm">Unavailable</span>
                )}
                {input.paymentMethod === payment.value ? (
                  <MdRadioButtonChecked className="w-5 h-5 ms-3 flex-shrink-0" />
                ) : (
                  <MdRadioButtonUnchecked className="w-5 h-5 ms-3 flex-shrink-0" />
                )}
              </div>
            </label>
          </li>
        ))}
      </ul>

      <StepButton nextDisabled={!input.paymentMethod} />
    </form>
  );
};

export default PaymentMethod;
