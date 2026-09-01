"use client";

import React, { useState, useEffect, Suspense } from "react";
import useCartStore from "@/lib/stores/cart.store";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useSession } from "@/context/SessionContext";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  CreateOrderInput,
  DeliveryDetails,
} from "@/interfaces/product.interface";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CheckoutFormInput {
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  suiteNumber?: string;
  billingSameAsShipping: boolean;
  billingAddress?: string;
}

const CheckoutPageContent = () => {
  const { cartItems, totalPricePaid, setTotalPricePaid, clearCart } =
    useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormInput>({
    defaultValues: {
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      streetAddress: "",
      city: "",
      zipCode: "",
      suiteNumber: "",
      billingSameAsShipping: true,
      billingAddress: "",
    },
  });

  const emailVal = watch("email");
  const phoneVal = watch("phone");
  const streetAddressVal = watch("streetAddress");
  const cityVal = watch("city");
  const zipCodeVal = watch("zipCode");
  const suiteNumberVal = watch("suiteNumber");
  const billingSameAsShippingVal = watch("billingSameAsShipping");
  const billingAddressVal = watch("billingAddress");

  const [isEditingEmail, setIsEditingEmail] = useState(!user?.email);
  const [isEditingPhone, setIsEditingPhone] = useState(!user?.phoneNumber);
  const [isEditingAddress, setIsEditingAddress] = useState(true);

  // Payment Method selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("paystack");

  // Loading indicator for order submission
  const [loading, setLoading] = useState(false);

  // Price calculations
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.qty,
      0,
    );
    const shippingFee = cartItems.reduce(
      (acc, item) => acc + item.deliveryFee * item.qty,
      0,
    );
    const tax = 0;
    const total = subtotal + shippingFee;
    return { subtotal, shippingFee, tax, total };
  };

  const { subtotal, shippingFee, tax, total } = calculateTotals();

  // Save totals in global state
  useEffect(() => {
    if (total > 0) {
      setTotalPricePaid(total);
    }
  }, [total, setTotalPricePaid]);

  // Paystack Config

  // Complete Order API call
  const handleCompleteOrder = async (
    formData: CheckoutFormInput,
    paymentRef?: string,
    paymentData?: string,
  ) => {
    const deliveryDetails: DeliveryDetails = {
      suiteNumber: formData.suiteNumber || "",
      streetAddress: formData.streetAddress || "No Address Provided",
      city: formData.city || "Nigeria",
      zipCode: formData.zipCode || "23401",
    };

    const input: CreateOrderInput = {
      products: cartItems.map(({ deliveryFee, product, qty }) => ({
        product: product?._id,
        qty,
        deliveryFee,
      })),
      deliveryDetails,
      totalPricePaid: total,
      paymentMethod: selectedPaymentMethod,
      paymentReference: paymentRef || "pay-cod-" + Date.now(),
      paymentData: paymentData || "Cash On Delivery order",
    };

    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/users/orders/create-order",
        input,
      );

      if (data.success) {
        clearCart();
        toast.success("Order placed successfully!");
        router.push("/checkout/success");
      } else {
        toast.error("Failed to place order.");
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        "An error occurred while creating order.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Checkout Action Button
  const handleCheckoutSubmit = async (formData: CheckoutFormInput) => {
    if (selectedPaymentMethod === "paystack") {
      const deliveryDetails: DeliveryDetails = {
        suiteNumber: formData.suiteNumber || "",
        streetAddress: formData.streetAddress || "No Address Provided",
        city: formData.city || "Nigeria",
        zipCode: formData.zipCode || "23401",
      };

      const input = {
        products: cartItems.map(({ deliveryFee, product, qty }) => ({
          product: product?._id,
          qty,
          deliveryFee,
        })),
        deliveryDetails,
        totalPricePaid: total,
        paymentMethod: selectedPaymentMethod,
      };

      try {
        setLoading(true);
        const { data } = await axiosInstance.post(
          "/users/orders/initialize-payment",
          input,
        );

        if (data.success && data.authorization_url) {
          window.location.href = data.authorization_url;
        } else {
          toast.error("Failed to initialize payment.");
        }
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.message ||
          "An error occurred while initializing payment.";
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    } else {
      // Cash on delivery or alternate method
      handleCompleteOrder(formData);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center space-y-6 max-w-md mx-auto px-6">
        <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 rounded-full flex items-center justify-center">
          <ShoppingCart className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
            Looks like you haven't added anything to your cart yet. Head back to
            the store to configure your solar setups.
          </p>
        </div>
        <Link href="/shop">
          <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold rounded-xl gap-2 px-6 h-11 text-xs">
            Go Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 min-h-screen pb-16">
      {/* Hero Diagonal Stripes Banner */}
      <div className="w-full bg-[#08AA08] relative overflow-hidden py-16 flex flex-col justify-center items-center text-center text-white">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#079907_25%,transparent_25%,transparent_50%,#079907_50%,#079907_75%,transparent_75%,transparent)] bg-[length:40px_40px] opacity-25 z-0" />
        <h1 className="text-4xl font-extrabold tracking-tight relative z-10">
          Checkout
        </h1>
      </div>

      <div className="container mx-auto px-6 mt-8 max-w-6xl space-y-6">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
          <Link href="/shop" className="hover:underline">
            Store
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:underline">
            Cart
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white">Checkout</span>
        </div>

        {/* Checkout Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping Info Card */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Shipping Info
              </h2>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
                {/* Email Field */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-zinc-400">
                      Email
                    </span>
                    {isEditingEmail ? (
                      <div className="flex-1 max-w-md">
                        <Input
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder="your-email@email.com"
                          className="h-9 text-xs"
                        />
                        {errors.email && (
                          <p className="text-[10px] text-red-500 font-semibold mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {emailVal}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                    className="text-xs font-bold text-[#08AA08] hover:underline shrink-0 ml-4"
                  >
                    {isEditingEmail ? "Save" : "Change"}
                  </button>
                </div>

                {/* Phone Field */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-zinc-400">
                      Phone
                    </span>
                    {isEditingPhone ? (
                      <div className="flex-1 max-w-md">
                        <Input
                          type="tel"
                          {...register("phone", {
                            required: "Phone number is required",
                          })}
                          placeholder="+234 80 1234 5678"
                          className="h-9 text-xs"
                        />
                        {errors.phone && (
                          <p className="text-[10px] text-red-500 font-semibold mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {phoneVal}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                    className="text-xs font-bold text-[#08AA08] hover:underline shrink-0 ml-4"
                  >
                    {isEditingPhone ? "Save" : "Change"}
                  </button>
                </div>

                {/* Shipping Address Fields */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <span className="text-xs font-bold text-zinc-400">
                      Ship To
                    </span>
                    {isEditingAddress ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl">
                        <div>
                          <Input
                            placeholder="Street Address"
                            {...register("streetAddress", {
                              required: "Street Address is required",
                            })}
                            className="h-9 text-xs"
                          />
                          {errors.streetAddress && (
                            <p className="text-[10px] text-red-500 font-semibold mt-1">
                              {errors.streetAddress.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            placeholder="City/State"
                            {...register("city", {
                              required: "City/State is required",
                            })}
                            className="h-9 text-xs"
                          />
                          {errors.city && (
                            <p className="text-[10px] text-red-500 font-semibold mt-1">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Input
                            placeholder="Suite/Apartment Number (Optional)"
                            {...register("suiteNumber")}
                            className="h-9 text-xs"
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Zip Code"
                            {...register("zipCode", {
                              required: "Zip Code is required",
                            })}
                            className="h-9 text-xs"
                          />
                          {errors.zipCode && (
                            <p className="text-[10px] text-red-500 font-semibold mt-1">
                              {errors.zipCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {suiteNumberVal ? `${suiteNumberVal}, ` : ""}
                        {streetAddressVal}, {cityVal} (Zip: {zipCodeVal})
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs font-bold text-[#08AA08] hover:underline shrink-0 ml-4 mt-1"
                  >
                    {isEditingAddress ? "Save" : "Change"}
                  </button>
                </div>
              </div>
            </div>

            {/* Standard Shipping announcement */}
            <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-400">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xs font-bold">
                  Standard Shipping Within Nigeria
                </p>
              </div>
              <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                (4-5 Working Days)
              </p>
            </div>

            {/* Billing Address Card */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Billing Address
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Select the address that matches your card or payment details.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 space-y-4">
                {/* Same Address */}
                <label className="flex items-center gap-3 cursor-pointer ">
                  <input
                    type="radio"
                    name="billing-same"
                    checked={billingSameAsShippingVal === true}
                    onChange={() => setValue("billingSameAsShipping", true)}
                    className="accent-[#08AA08] h-4.5 w-4.5"
                  />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                    Same as Shipping Address
                  </span>
                </label>

                {/* Different Address */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer ">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="billing-same"
                        checked={billingSameAsShippingVal === false}
                        onChange={() =>
                          setValue("billingSameAsShipping", false)
                        }
                        className="accent-[#08AA08] h-4.5 w-4.5"
                      />
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                        Use a Different Billing Address
                      </span>
                    </div>
                  </label>

                  {!billingSameAsShippingVal && (
                    <div className="pl-7 pt-1 max-w-xl">
                      <Input
                        placeholder="Enter Billing Address"
                        {...register("billingAddress", {
                          validate: (val) => {
                            if (!billingSameAsShippingVal && !val) {
                              return "Billing address is required when different from shipping address";
                            }
                            return true;
                          },
                        })}
                        className="h-9 text-xs"
                      />
                      {errors.billingAddress && (
                        <p className="text-[10px] text-red-500 font-semibold mt-1">
                          {errors.billingAddress.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Payment Method
              </h2>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer ">
                  <input
                    type="radio"
                    name="payment-method"
                    value="paystack"
                    checked={selectedPaymentMethod === "paystack"}
                    onChange={() => setSelectedPaymentMethod("paystack")}
                    className="accent-[#08AA08] h-4.5 w-4.5"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                      Paystack (Cards, Transfer, USSD)
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      Complete secure online checkout powered by Paystack
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
              {/* Summary Items Header */}
              <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800">
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1">
                  <span>&gt;</span> Summary
                </h3>
                <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-650 px-2 py-0.5 rounded-full font-bold">
                  {cartItems.length} Item{cartItems.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* Summary Miniature Items list */}
              <ScrollArea className="space-y-4 max-h-[180px] pr-1">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-center justify-between py-1"
                  >
                    <div className="flex gap-2.5 items-center">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-zinc-50 border relative shrink-0">
                        <Image
                          src={
                            item.product?.images?.[0]?.url ||
                            "/placeholder-product.jpg"
                          }
                          alt={item.product?.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-zinc-500 text-white rounded-full text-[8px] font-bold w-4.5 h-4.5 flex items-center justify-center">
                          {item.qty}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1 max-w-[150px]">
                          {item.product?.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-semibold">
                          Qty:{" "}
                          <span className="font-extrabold text-foreground">
                            {item.qty}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                      {formatCurrency(item.product?.price * item.qty, "NGN")}
                    </span>
                  </div>
                ))}
              </ScrollArea>

              {/* Price list details */}
              <div className="space-y-3 pt-3 border-t dark:border-zinc-800 text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                <div className="flex justify-between items-center">
                  <span>Sub Total</span>
                  <span className="text-zinc-900 dark:text-white font-extrabold">
                    {formatCurrency(subtotal, "NGN")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="text-zinc-900 dark:text-white font-extrabold">
                    {formatCurrency(shippingFee, "NGN")}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t dark:border-zinc-800 text-sm font-extrabold text-zinc-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatCurrency(total, "NGN")}</span>
                </div>
              </div>

              {/* Checkout Action Button triggers */}
              <div className="space-y-3.5 pt-4 border-t dark:border-zinc-800">
                <Button
                  onClick={handleSubmit(handleCheckoutSubmit)}
                  disabled={loading}
                  className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold rounded-xl h-11 text-xs gap-1.5"
                >
                  {loading ? "Processing Order..." : "Continue"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Disclaimer block */}
              <div className="space-y-2 pt-4 border-t dark:border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                  Good to know
                </h4>
                <h5 className="text-[11px] font-bold text-zinc-900 dark:text-white">
                  This Product Requires Installation
                </h5>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Get this product as part of a complete solar setup that
                  includes panels, batteries, and expert installation all
                  optimized for performance and savings. Installation is
                  completely free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { loading } = useSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#08AA08]" />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutPageContent />
    </Suspense>
  );
};

export default CheckoutPage;
