"use client";
import { CallbackResponse } from "@/interfaces/payment.interface";
import {
  CreateOrderInput,
  DeliveryDetails,
} from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import useCartStore from "@/lib/stores/cart.store";
import { Button, Spinner } from "@heroui/react";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";

const Payment = () => {
  const {
    cartItems,
    deliveryDetails,
    paymentMethod,
    setPaymentData,
    setDeliveryDetails,
    setTotalPricePaid,
    setPaymentMethod,
    totalPricePaid,
    paymentData,
    clearCart,
  } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  const input: CreateOrderInput = {
    products: cartItems.map(({ deliveryFee, product, qty }) => ({
      product: product?._id,
      qty,
      deliveryFee,
    })),
    deliveryDetails,
    totalPricePaid,
    paymentMethod,
    paymentReference: "",
    paymentData,
  };

  const config = {
    reference: user?._id + "-" + Date.now(),
    email: user?.email,
    first_name: user?.firstname,
    last_name: user?.lastname,
    publicKey,
    amount: totalPricePaid * 100,
  };

  const onSuccess = (response: CallbackResponse) => {
    if (response.status === "success" && response?.reference) {
      const paymentdata = JSON.stringify(response);

      input.paymentReference = response?.reference;
      input.paymentData = paymentdata;

      const createOrder = async () => {
        try {
          setLoading(true);
          const { data } = await axiosInstance.post(
            "/users/orders/create-order",
            input
          );

          if (data.success) {
            clearCart();
            setDeliveryDetails({} as DeliveryDetails);
            setTotalPricePaid(0);
            setPaymentMethod("");
            setPaymentData("");

            toast.success("Order placed successfully!");
            router.push("/orders/success");
          }
        } catch (error: any) {
          console.log(error?.response?.data.message);
          setError(error?.response?.data.message);
          toast.error("Failed to place order. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      createOrder();
    }
  };

  const onClose = () => {
    setErrorMsg("Your payment was unsuccessful. Please try again later.");
  };

  const initializePayment = usePaystackPayment(config);

  if (loading) {
    return (
      <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 px-4">
        <div className="relative light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-lg p-8 max-w-[500px]">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <h2 className="text-lg font-semibold">Processing Order...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 px-4">
        <div className="relative light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-lg p-8 max-w-[500px]">
          <div className="flex flex-col items-center">
            <CircleX size={60} className="text-red-600" />
            <p className="text-lg font-semibold my-4 text-center">{error}</p>
            <Button variant="faded" onPress={() => setError("")}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="solid"
        color="primary"
        onPress={() => initializePayment({ onSuccess, onClose })}
      >
        Proceed to payment
      </Button>

      {errorMsg && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="relative light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-lg p-8 max-w-[500px]">
            <div className="flex flex-col items-center">
              <CircleX size={60} className="text-red-600" />
              <p className="text-lg font-semibold my-4 text-center">
                {errorMsg}
              </p>
              <Button variant="faded" onPress={() => setErrorMsg("")}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
