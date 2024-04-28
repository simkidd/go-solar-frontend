"use client";
import {
  CreateOrderInput,
  DeliveryDetails,
} from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import useCartStore from "@/lib/stores/useCart";
import { formatCurrency } from "@/utils/helpers";
import { Spinner } from "@nextui-org/react";
import { CheckCircle, CircleX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Payment from "../components/Payment";
import { FaXmark } from "react-icons/fa6";

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
  const [showCreatingOrderModal, setShowCreatingOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
  const refParams = searchParams.get("ref")?.toString();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  useEffect(() => {
    (async () => {
      if (refParams) {
        try {
          setShowCreatingOrderModal(true);
          setLoading(true);
          const { data } = await axiosInstance.post(
            "users/orders/create-order",
            dataInput
          );
          console.log("order confirmed", data.data);

          setSuccessMsg(data.data.message);
          clearCart();
          setDeliveryDetails({} as DeliveryDetails);
          setTotalPricePaid(0);
          setPaymentData("");

          setOrderSuccess(true);
          setTimeout(() => {
            router.push("/cart");
          }, 2000);
        } catch (error) {
          if (error) {
            params.delete("ref");
          }
          const errorMsg = error as any;
          console.log(errorMsg?.response?.data.message);
          setErrorMsg(errorMsg?.response?.data.message);
        } finally {
          setLoading(false);
          // setTimeout(() => {
          //   setShowCreatingOrderModal(false);
          // }, 2000);
        }
      }
    })();
  });

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
          <Payment />
        </div>
      </div>

      {/* Creating Order Modal */}
      {showCreatingOrderModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="relative light bg-[#f1f1f1] dark:bg-[#2a2b2f] rounded-lg p-8 max-w-[500px]">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <h2 className="text-lg font-semibold">Processing Order...</h2>
              </div>
            ) : (
              <>
                {orderSuccess ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle size={60} className="text-green-600" />
                    <h2 className="text-lg font-semibold my-4">
                      Order Placed Successfully
                    </h2>
                    <p className="">Your order has been successfully placed!</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <CircleX size={60} className="text-red-600" />
                    <p className="text-lg font-semibold my-4 text-center">
                      {errorMsg}
                    </p>
                    <button
                      className="border border-primary mt-2 text-primary px-4 py-2 rounded-md"
                      onClick={() => setShowCreatingOrderModal(false)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrderPage;
