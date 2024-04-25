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

  useEffect(() => {
    (async () => {
      if (searchParams) {
        try {
          // setLoading(true);
          const { data } = await axiosInstance.post(
            "users/orders/create-order",
            dataInput
          );
          console.log("order confirmed", data.data);

          alert("order confirmed");
          // router.push("/");
          // clearCart();
          // setDeliveryDetails({} as DeliveryDetails);
          // setTotalPricePaid(0);
        } catch (error) {
          const errorMsg = error as any;
          toast.error(errorMsg?.response?.data.message)
          console.log(errorMsg?.response?.data.message);
        }
      }
    })();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-2 py-16">
      <div className="max-w-[600px] mx-auto">
        <CheckoutSteps activeStep={3} />
        <h2 className="text-3xl font-bold mb-8">Place Order</h2>
        <div>
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <ul>
            {cartItems.map((cartItem, index) => (
              <li key={index}>
                {cartItem?.product?.name} - Quantity: {cartItem.qty}
              </li>
            ))}
          </ul>
          <p>Total Price: {formatCurrency(totalPricePaid, "NGN")}</p>
          <p>
            Delivery Address: {deliveryDetails.streetAddress},{" "}
            {deliveryDetails.city}, {deliveryDetails.zipCode}
          </p>
          <p>Payment Method: {paymentMethod}</p>
          {/* <button
            type="submit"
            className="bg-primary px-8 py-2 text-white rounded-md hover:bg-primary-dark transition duration-300"
            onClick={handlePlaceOrder}
          >
            {loading ? "Confirming..." : "Place order"}
          </button> */}
          <Payment />
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
