"use client";
import React, { useEffect, useState } from "react";
import { DeliveryDetails } from "@/interfaces/product.interface";
import useCartStore from "@/lib/stores/cart.store";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useRouter } from "next/navigation";
import StepButton from "./StepButtons";
import { Input } from "@heroui/react";

const ShippingDetailsForm = () => {
  const { user } = useAuthStore();
  const { setDeliveryDetails, setCurrentStep, deliveryDetails } =
    useCartStore();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Initialize form state with delivery details or empty values
  const [shipping, setShipping] = useState<DeliveryDetails>({
    suiteNumber: deliveryDetails.suiteNumber || "",
    streetAddress: deliveryDetails.streetAddress || "",
    city: deliveryDetails.city || "",
    zipCode: deliveryDetails.zipCode || "",
  });
  const [loading, setLoading] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/account/login");
    }
  }, [user, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!shipping.suiteNumber)
      newErrors.suiteNumber = "Suite number is required";
    if (!shipping.streetAddress)
      newErrors.streetAddress = "Street address is required";
    if (!shipping.city) newErrors.city = "City is required";
    if (!shipping.zipCode) newErrors.zipCode = "Zip code is required";
    // if (!/^\d{5}(-\d{4})?$/.test(shipping.zipCode)) {
    //   newErrors.zipCode = "Invalid zip code format";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipping((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setDeliveryDetails(shipping);
      setCurrentStep(2);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {/* Suite Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400">
          Suite Number
        </label>
        <Input
          type="text"
          name="suiteNumber"
          value={shipping.suiteNumber}
          onChange={handleChange}
          classNames={{
            inputWrapper:
              "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
          }}
          placeholder="Enter suite number"
          isInvalid={!!errors.suiteNumber}
          errorMessage={errors.suiteNumber}
        />
      </div>

      {/* Street Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400">
          Street Address
        </label>
        <Input
          type="text"
          name="streetAddress"
          value={shipping.streetAddress}
          onChange={handleChange}
          classNames={{
            inputWrapper:
              "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
          }}
          placeholder="Enter street address"
          isInvalid={!!errors.streetAddress}
          errorMessage={errors.streetAddress}
        />
      </div>

      {/* City */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400">City</label>
        <Input
          type="text"
          name="city"
          value={shipping.city}
          onChange={handleChange}
          classNames={{
            inputWrapper:
              "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
          }}
          placeholder="Enter city"
          isInvalid={!!errors.city}
          errorMessage={errors.city}
        />
      </div>

      {/* Zip Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400">
          Zip Code
        </label>
        <Input
          type="text"
          name="zipCode"
          value={shipping.zipCode}
          onChange={handleChange}
          classNames={{
            inputWrapper:
              "group-data-[focus-visible=true]:ring-primary group-data-[focus-visible=true]:ring-0",
          }}
          placeholder="Enter zip code"
          isInvalid={!!errors.zipCode}
          errorMessage={errors.zipCode}
        />
      </div>

      {/* Step Buttons */}
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
