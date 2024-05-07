"use client";
import {
  CreateOrderInput,
  DeliveryDetails,
} from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import useCartStore from "@/lib/stores/cart.store";
import { Spinner } from "@nextui-org/react";
import { CheckCircle, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ConfirmationComp = ({
  searchParams,
}: {
  searchParams: { ref: string };
}) => {
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const router = useRouter();

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
    (async () => {
      if (searchParams.ref) {
        try {
          setLoading(true);
          const { data } = await axiosInstance.post(
            "/users/orders/create-order",
            dataInput
          );
          console.log("order confirmed", data.order);

          setSuccess(data?.message);
          clearCart();
          setDeliveryDetails({} as DeliveryDetails);
          setTotalPricePaid(0);
          setPaymentData("");

          setOrderSuccess(true);
          setTimeout(() => {
            router.push("/shop");
          }, 2000);
        } catch (error) {
          const errorMsg = error as any;
          console.log(errorMsg?.response?.data.message);
          setError(errorMsg?.response?.data.message);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/payment");
        return;
      }
    })();
  }, [searchParams.ref, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <h2 className="text-lg font-semibold">Processing Order...</h2>
      </div>
    );
  }

  if (error && !orderSuccess) {
    return (
      <div className="flex flex-col items-center">
        <CircleX size={60} className="text-red-600" />
        <p className="text-lg font-semibold my-4 text-center">{error}</p>
        <button onClick={() => router.push("/payment")}>Go back</button>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center">
        <CheckCircle size={60} className="text-green-600" />
        <h2 className="text-lg font-semibold my-4">
          Order Placed Successfully
        </h2>
        <p className="">{success}</p>
      </div>
    );
  }

  return null;
};

export default ConfirmationComp;
