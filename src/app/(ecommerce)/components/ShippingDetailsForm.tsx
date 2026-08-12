"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DeliveryDetails } from "@/interfaces/product.interface";
import StepButton from "./StepButtons";
import useCartStore from "@/lib/stores/cart.store";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const ShippingDetailsForm = () => {
  const { user } = useAuthStore();
  const { setDeliveryDetails, setCurrentStep, deliveryDetails } = useCartStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryDetails>({
    defaultValues: {
      suiteNumber: deliveryDetails?.suiteNumber || "",
      streetAddress: deliveryDetails?.streetAddress || "",
      city: deliveryDetails?.city || "",
      zipCode: deliveryDetails?.zipCode || "",
    },
  });

  useEffect(() => {
    if (!user) {
      router.push("/account/login?redirectUrl=/checkout");
    }
  }, [router, user]);

  const onSubmit = (values: DeliveryDetails) => {
    setDeliveryDetails(values);
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-4 font-inter">
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Suite / Apt Number <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="e.g. Suite 4B or Flat 2"
          {...register("suiteNumber", { required: "Suite number is required" })}
          className="border-zinc-200 dark:border-zinc-800 rounded-xl"
        />
        {errors.suiteNumber && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.suiteNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Street Address <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="e.g. 15 Aba Road, Rumuokoro"
          {...register("streetAddress", { required: "Street address is required" })}
          className="border-zinc-200 dark:border-zinc-800 rounded-xl"
        />
        {errors.streetAddress && (
          <p className="text-[11px] text-rose-500 font-semibold pl-1">
            {errors.streetAddress.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            City / State <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Port Harcourt"
            {...register("city", { required: "City is required" })}
            className="border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          {errors.city && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Zip / Postal Code <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. 500001"
            {...register("zipCode", { required: "Postal code is required" })}
            className="border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
          {errors.zipCode && (
            <p className="text-[11px] text-rose-500 font-semibold pl-1">
              {errors.zipCode.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <StepButton />
      </div>
    </form>
  );
};

export default ShippingDetailsForm;
