"use client";
import { DeliveryDetails } from "@/interfaces/product.interface";
import React, { useEffect, useState } from "react";
import StepButton from "./StepButtons";
import useCartStore from "@/lib/stores/cart.store";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useRouter } from "next/navigation";

const ShippingDetailsForm = () => {
  const { user } = useAuthStore();
  const { setDeliveryDetails, setCurrentStep, deliveryDetails } =
    useCartStore();
  const router = useRouter();
  const [shipping, setShipping] = useState<DeliveryDetails>({
    suiteNumber: deliveryDetails.suiteNumber || "",
    streetAddress: deliveryDetails.streetAddress || "",
    city: deliveryDetails.city || "",
    zipCode: deliveryDetails.zipCode || "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/account/login");
      return;
    }
  }, [router, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipping((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shipping.suiteNumber ||
      !shipping.streetAddress ||
      !shipping.city ||
      !shipping.zipCode
    ) {
      toast.info("All fields are required to proceed");
      return;
    } else {
      setDeliveryDetails(shipping);
      setCurrentStep(2);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400">
          Suite Number
        </label>
        <input
          type="text"
          name="suiteNumber"
          value={shipping.suiteNumber}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300  focus:outline-none focus:border-primary bg-transparent"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400">
          Street Address
        </label>
        <input
          type="text"
          name="streetAddress"
          value={shipping.streetAddress}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300  focus:outline-none focus:border-primary bg-transparent"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400">City</label>
        <input
          type="text"
          name="city"
          value={shipping.city}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300  focus:outline-none focus:border-primary bg-transparent"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400">
          Zip Code
        </label>
        <input
          type="text"
          name="zipCode"
          value={shipping.zipCode}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300  focus:outline-none focus:border-primary bg-transparent"
        />
      </div>
      <StepButton
        nextDisabled={
          !shipping.suiteNumber ||
          !shipping.streetAddress ||
          !shipping.city ||
          !shipping.zipCode
        }
      />
    </form>
  );
};

export default ShippingDetailsForm;
