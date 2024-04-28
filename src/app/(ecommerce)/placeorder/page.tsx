"use client";
import useCartStore from "@/lib/stores/useCart";
import { formatCurrency } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import Payment from "../components/Payment";

const PlaceOrderPage = () => {
  const { cartItems, deliveryDetails, paymentMethod, totalPricePaid } =
    useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

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
    </div>
  );
};

export default PlaceOrderPage;
