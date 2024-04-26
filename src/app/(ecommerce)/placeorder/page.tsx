"use client";
import useCartStore from "@/lib/stores/useCart";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { formatCurrency } from "@/utils/helpers";
import { axiosInstance } from "@/lib/axios";
import {
  CreateOrderInput,
  DeliveryDetails,
} from "@/interfaces/product.interface";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import Payment from "../components/Payment";

const PlaceOrderPage = () => {
  const {
    cartItems,
    deliveryDetails,
    paymentMethod,
    paymentReference,
    setPaymentData,
    setDeliveryDetails,
    setTotalPricePaid,
    totalPricePaid,
    paymentData,
    clearCart,
  } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const dataInput: CreateOrderInput = {
    products: cartItems.map(({ deliveryFee, product, qty }) => ({
      product: product?._id,
      qty,
      deliveryFee,
    })),
    deliveryDetails,
    totalPricePaid,
    paymentMethod,
    paymentReference,
    paymentData,
  };

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const refParams = searchParams.get("ref")?.toString();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    (async () => {
      if (refParams) {
        try {
          setLoading(true);
          const { data } = await axiosInstance.post(
            "users/orders/create-order",
            dataInput
          );
          console.log("order confirmed", data.data);

          alert(data.data.message);
          router.push("/");
          clearCart();
          setDeliveryDetails({} as DeliveryDetails);
          setTotalPricePaid(0);
        } catch (error) {
          if(error){
            params.delete("ref");
          }
          const errorMsg = error as any;
          toast.error(errorMsg?.response?.data.message);
          console.log(errorMsg?.response?.data.message);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [refParams]);

  return (
    <div className="container mx-auto px-2 py-16">
      <div className="max-w-[600px] mx-auto">
        <CheckoutSteps activeStep={2} />
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <ul>
            {cartItems.map((cartItem, index) => (
              <li key={index}>
                {cartItem?.product?.name} - Quantity: {cartItem.qty}
              </li>
            ))}
          </ul>
          <p className="text-lg mt-4">
            Total Price: {formatCurrency(totalPricePaid, "NGN")}
          </p>
          <p className="text-lg mt-4">
            Delivery Address: {deliveryDetails.streetAddress},{" "}
            {deliveryDetails.city}, {deliveryDetails.zipCode}
          </p>
          <p className="text-lg mt-4">Payment Method: {paymentMethod}</p>
          {loading ? (
            <p className="text-lg mt-4">Confirming order...</p>
          ) : (
            <Payment />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
