"use client";
import useCartStore, { CartItem } from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import React, { useEffect } from "react";
import Payment from "./Payment";
import { useRouter } from "next/navigation";
import { DeliveryDetails } from "@/interfaces/product.interface";

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

  useEffect(() => {
    if (!paymentMethod) {
      setCurrentStep(1);
      return;
    }
  }, [paymentMethod]);

  const handleCancel = () => {
    router.push("/cart");
    setCurrentStep(1);
    setDeliveryDetails({} as DeliveryDetails);
    setPaymentMethod("");
  };

  const calculateTotals = (cartItems: CartItem[]) => {
    const subtotal = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.product.price * cartItem.qty,
      0
    );
    const deliveryFee = cartItems.reduce(
      (acc, cartItem) => acc + cartItem.deliveryFee,
      0
    );
    const total = subtotal + deliveryFee;
    return { total, subtotal, deliveryFee };
  };

  const { subtotal, deliveryFee } = calculateTotals(cartItems);

  return (
    <div className="py-6">
      <h3 className="text-xl font-bold mb-4">Order Summary</h3>
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Items:</h4>
        <ul className="divide-y divide-gray-200">
          {cartItems.map((cartItem, index) => (
            <li key={index} className="py-4 flex items-center">
              <img
                src={cartItem?.product?.images[0].url}
                alt={cartItem?.product?.name}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div className="flex flex-col flex-grow">
                <span className="font-medium">{cartItem?.product?.name}</span>
                <span className="text-sm text-gray-500">
                  Quantity: {cartItem.qty}
                </span>
              </div>
              <span className="font-medium">
                {formatCurrency(cartItem?.product?.price * cartItem.qty, "NGN")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Delivery Address:</h4>
        <div className="p-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-md">
          <p>{deliveryDetails.streetAddress},</p>
          <p>{deliveryDetails.city},</p>
          <p>{deliveryDetails.zipCode}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Payment Method:</h4>
        <div className="p-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-md">
          <p>{paymentMethod}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Price Details:</h4>
        <div className="p-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-md">
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

      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-300 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-300"
          type="button"
          onClick={handleCancel}
        >
          Back to Cart
        </button>

        <Payment />
      </div>
    </div>
  );
};

export default OrderSummary;
