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
import { toast } from "react-toastify";

interface PaymentType {
  name: string;
  value: string;
  icon: IconType | LucideIcon;
  disabled: boolean;
}

const paymentTypes: PaymentType[] = [
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethod || ""
  );

  // Redirect to login if user is not authenticated or delivery details are missing
  useEffect(() => {
    if (!user) {
      router.push("/account/login");
      return;
    }
    if (!deliveryDetails.streetAddress) {
      setCurrentStep(1);
      return;
    }
  }, [user, deliveryDetails, router, setCurrentStep]);

  // Handle payment method selection
  const handlePaymentMethodChange = (value: string) => {
    setSelectedPaymentMethod(value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    setPaymentMethod(selectedPaymentMethod);
    setCurrentStep(3);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-8">Payment Method</h2>
      <p className="mb-4">Select a payment method</p>

      <ul className="w-full mb-8">
        {paymentTypes.map((payment) => (
          <li key={payment.value} className="mb-4">
            <input
              name="paymentMethod"
              className="hidden peer"
              id={payment.value}
              type="radio"
              value={payment.value}
              checked={selectedPaymentMethod === payment.value}
              onChange={() => handlePaymentMethodChange(payment.value)}
              disabled={payment.disabled}
              required
            />

            <label
              htmlFor={payment.value}
              className={`flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer transition-all ${
                selectedPaymentMethod === payment.value
                  ? "border-primary text-primary"
                  : "hover:border-gray-400 hover:text-gray-600"
              } ${
                payment.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <payment.icon size={24} />
                <span>{payment.name}</span>
              </div>

              <div className="flex items-center">
                {payment.disabled && (
                  <span className="text-sm text-gray-400">Unavailable</span>
                )}
                {selectedPaymentMethod === payment.value ? (
                  <MdRadioButtonChecked className="w-5 h-5 ml-3 text-primary" />
                ) : (
                  <MdRadioButtonUnchecked className="w-5 h-5 ml-3 text-gray-400" />
                )}
              </div>
            </label>
          </li>
        ))}
      </ul>

      <StepButton nextDisabled={!selectedPaymentMethod} />
    </form>
  );
};

export default PaymentMethod;