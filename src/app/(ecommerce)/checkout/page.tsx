"use client";

import React, { useState, useEffect, Suspense } from "react";
import useCartStore from "@/lib/stores/cart.store";
import { useAuthStore } from "@/lib/stores/auth.store";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePaystackPayment } from "react-paystack";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CallbackResponse } from "@/interfaces/payment.interface";
import {
  CreateOrderInput,
  DeliveryDetails,
} from "@/interfaces/product.interface";
import { ScrollArea } from "@/components/ui/scroll-area";

const CheckoutPageContent = () => {
  const { cartItems, totalPricePaid, setTotalPricePaid, clearCart } =
    useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      toast.info("Please sign in to proceed with checkout.");
      router.push("/account/login?redirect=/checkout");
    }
  }, [user, router]);

  // Shipping details state
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [suiteNumber, setSuiteNumber] = useState("");

  const [isEditingEmail, setIsEditingEmail] = useState(!user?.email);
  const [isEditingPhone, setIsEditingPhone] = useState(!user?.phoneNumber);
  const [isEditingAddress, setIsEditingAddress] = useState(true);

  // Billing address state
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState("");

  // Coupon code state
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0); // Optional promo discounts

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
    const tax = Math.round(subtotal * 0.05); // 5% VAT
    const total = subtotal + shippingFee + tax - discountAmount;
    return { subtotal, shippingFee, tax, total };
  };

  const { subtotal, shippingFee, tax, total } = calculateTotals();

  // Save totals in global state
  useEffect(() => {
    if (total > 0) {
      setTotalPricePaid(total);
    }
  }, [total, setTotalPricePaid]);

  // Apply Coupon Logic
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "solar50") {
      setDiscountAmount(50000);
      toast.success("₦50,000 discount applied successfully!");
    } else if (couponCode.trim()) {
      toast.error("Invalid coupon code.");
    }
  };

  // Paystack Config
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  const paystackConfig = {
    reference: (user?._id || "guest") + "-" + Date.now(),
    email: email || user?.email || "billing@gosolar.com",
    publicKey,
    amount: total * 100, // in kobo
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: user ? `${user.firstname} ${user.lastname}` : "Customer",
        },
      ],
    },
  };

  const initializePaystackPayment = usePaystackPayment(paystackConfig);

  // Complete Order API call
  const handleCompleteOrder = async (
    paymentRef?: string,
    paymentData?: string,
  ) => {
    const deliveryDetails: DeliveryDetails = {
      suiteNumber,
      streetAddress: streetAddress || "No Address Provided",
      city: city || "Nigeria",
      zipCode: zipCode || "23401",
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
        router.push("/orders/success");
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
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!streetAddress || !city || !phone) {
      toast.info("Please fill in shipping address and contact details.");
      return;
    }

    if (selectedPaymentMethod === "paystack") {
      initializePaystackPayment({
        onSuccess: (response: CallbackResponse) => {
          if (response.status === "success" && response?.reference) {
            handleCompleteOrder(response.reference, JSON.stringify(response));
          }
        },
        onClose: () => {
          toast.warning("Payment canceled.");
        },
      });
    } else {
      // Cash on delivery or alternate method
      handleCompleteOrder();
    }
  };

  if (!user || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ShoppingBag className="h-10 w-10 text-zinc-300" />
        <p className="text-sm font-semibold text-zinc-500">
          Your cart is empty or you need to log in.
        </p>
        <Link href="/shop">
          <Button className="bg-[#08AA08] text-white rounded-xl">
            Return to Store
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
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your-email@email.com"
                        className="max-w-md h-9 text-xs"
                      />
                    ) : (
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {email}
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
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 80 1234 5678"
                        className="max-w-md h-9 text-xs"
                      />
                    ) : (
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {phone}
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
                        <Input
                          placeholder="Street Address"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          className="h-9 text-xs"
                        />
                        <Input
                          placeholder="City/State"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="h-9 text-xs"
                        />
                        <Input
                          placeholder="Suite/Apartment Number (Optional)"
                          value={suiteNumber}
                          onChange={(e) => setSuiteNumber(e.target.value)}
                          className="h-9 text-xs"
                        />
                        <Input
                          placeholder="Zip Code"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {suiteNumber ? `${suiteNumber}, ` : ""}
                        {streetAddress}, {city} (Zip: {zipCode})
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
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="billing-same"
                    checked={billingSameAsShipping}
                    onChange={() => setBillingSameAsShipping(true)}
                    className="accent-[#08AA08] h-4.5 w-4.5"
                  />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                    Same as Shipping Address
                  </span>
                </label>

                {/* Different Address */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="billing-same"
                        checked={!billingSameAsShipping}
                        onChange={() => setBillingSameAsShipping(false)}
                        className="accent-[#08AA08] h-4.5 w-4.5"
                      />
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                        Use a Different Billing Address
                      </span>
                    </div>
                  </label>

                  {!billingSameAsShipping && (
                    <div className="pl-7 pt-1 max-w-xl">
                      <Input
                        placeholder="Enter Billing Address"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="h-9 text-xs"
                      />
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
                <label className="flex items-center gap-3 cursor-pointer select-none">
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

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="payment-method"
                    value="cashOnDelivery"
                    checked={selectedPaymentMethod === "cashOnDelivery"}
                    onChange={() => setSelectedPaymentMethod("cashOnDelivery")}
                    className="accent-[#08AA08] h-4.5 w-4.5"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                      Cash On Delivery
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      Pay physically in cash upon successful installation
                      (subject to verify)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary Card */}
          <div className="lg:col-span-4 space-y-6">
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
                        <p className="text-[9px] text-zinc-400">
                          GoSolar setup
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

                <div className="flex justify-between items-center">
                  <span>Tax</span>
                  <span className="text-zinc-900 dark:text-white font-extrabold">
                    {formatCurrency(tax, "NGN")}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-red-500">
                    <span>Discount</span>
                    <span className="font-extrabold">
                      -{formatCurrency(discountAmount, "NGN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t dark:border-zinc-800 text-sm font-extrabold text-zinc-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatCurrency(total, "NGN")}</span>
                </div>
              </div>

              {/* Checkout Action Button triggers */}
              <div className="space-y-3.5 pt-4 border-t dark:border-zinc-800">
                <Button
                  onClick={handleCheckoutSubmit}
                  disabled={loading}
                  className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold rounded-xl h-11 text-xs gap-1.5"
                >
                  {loading ? "Processing Order..." : "Continue"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>

                <Link href="/energy-calculator" className="w-full block">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl h-11 text-xs"
                  >
                    Get Quote
                  </Button>
                </Link>
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
                  completely free.{" "}
                  <Link
                    href="/energy-calculator"
                    className="text-zinc-950 dark:text-white font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    Get Quote <span className="text-[8px]">↗</span>
                  </Link>{" "}
                  to see what's included.
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
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CheckoutPageContent />
    </Suspense>
  );
};

export default CheckoutPage;
