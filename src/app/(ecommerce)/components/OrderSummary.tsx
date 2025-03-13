"use client";
import useCartStore, { CartItem } from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import React, { useEffect } from "react";
import Payment from "./Payment";
import { useRouter } from "next/navigation";
import { DeliveryDetails } from "@/interfaces/product.interface";
import Image from "next/image";
import { toast } from "react-toastify";
import { Button } from "@heroui/react";

const OrderSummary = () => {
  const {
    cartItems,
    deliveryDetails,
    paymentMethod,
    totalPricePaid,
    setCurrentStep,
    setDeliveryDetails,
    setPaymentMethod,
  } = useCartStore();
  const router = useRouter();

  // Redirect if payment method is not selected
  useEffect(() => {
    if (!paymentMethod) {
      setCurrentStep(1);
      router.push("/checkout");
    }
  }, [paymentMethod, setCurrentStep, router]);

  // Handle cancel and reset checkout process
  const handleCancel = () => {
    router.push("/cart");
    setCurrentStep(1);
    setDeliveryDetails({} as DeliveryDetails);
    setPaymentMethod("");
    toast.info("Checkout process canceled.");
  };

  // Calculate order totals
  const calculateTotals = (cartItems: CartItem[]) => {
    const subtotal = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.product.price * cartItem.qty,
      0
    );
    const deliveryFee = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.deliveryFee * cartItem.qty,
      0
    );
    const total = subtotal + deliveryFee;
    return { total, subtotal, deliveryFee };
  };

  const { subtotal, deliveryFee } = calculateTotals(cartItems);

  return (
    <div className="py-6 px-2 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

      {/* Items List */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4">Items:</h4>
        <ul className="divide-y divide-gray-200">
          {cartItems.map((cartItem, index) => (
            <li key={index} className="py-4 grid grid-cols-[80px_auto] gap-4">
              <div className="w-20 h-20 rounded-md overflow-hidden">
                <Image
                  src={cartItem?.product?.images[0].url}
                  alt={cartItem?.product?.name}
                  className="object-cover w-full h-full"
                  width={80}
                  height={80}
                />
              </div>
              <div className="flex flex-col flex-grow">
                <span className="font-medium mb-1">
                  {cartItem?.product?.name}
                </span>
                <span className="text-sm text-gray-500 mb-2">
                  Quantity: {cartItem.qty}
                </span>
                <span className="font-medium">
                  {formatCurrency(
                    cartItem?.product?.price * cartItem.qty,
                    "NGN"
                  )}
                </span>
                <span className="text-sm text-primary font-medium">
                  + Delivery fee:{" "}
                  {formatCurrency(cartItem.deliveryFee * cartItem.qty, "NGN")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delivery Address */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4">Delivery Address:</h4>
        <div className="p-4 bg-gray-100 dark:bg-[#2a2b2f] rounded-md">
          <p>{deliveryDetails.streetAddress},</p>
          <p>{deliveryDetails.city},</p>
          <p>{deliveryDetails.zipCode}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4">Payment Method:</h4>
        <div className="p-4 bg-gray-100 dark:bg-[#2a2b2f] rounded-md capitalize">
          <p>{paymentMethod}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4">Order Details:</h4>
        <div className="p-4 bg-gray-100 dark:bg-[#2a2b2f] rounded-md">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal, "NGN")}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>{formatCurrency(deliveryFee, "NGN")}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{formatCurrency(totalPricePaid, "NGN")}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <Button type="button" onPress={handleCancel}>
          Back to Cart
        </Button>

        <Payment />
      </div>
    </div>
  );
};

export default OrderSummary;
