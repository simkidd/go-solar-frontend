"use client";
import { DeliveryDetails } from "@/interfaces/product.interface";
import useCartStore from "@/lib/stores/useCart";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";

const ShippingPage = () => {
  const { setDeliveryDetails } = useCartStore();
  const [shipping, setShipping] = useState<DeliveryDetails>({
    suiteNumber: "",
    streetAddress: "",
    city: "",
    zipCode: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipping((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { city, streetAddress, suiteNumber, zipCode } = shipping;

    if (!streetAddress || !city || !suiteNumber || !zipCode) {
      toast.warn("All fields are required");
      return;
    } else {
      setDeliveryDetails(shipping);
      router.push("/payment");
    }
  };

  return (
    <div className="container mx-auto px-2 py-16">
      <div className="max-w-[600px] mx-auto">
        <CheckoutSteps activeStep={0} />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Suite Number
            </label>
            <input
              type="text"
              name="suiteNumber"
              value={shipping.suiteNumber}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              name="streetAddress"
              value={shipping.streetAddress}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={shipping.city}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={shipping.zipCode}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="bg-primary px-8 py-2 text-white rounded-md hover:bg-primary-dark transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
