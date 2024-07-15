"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuthStore } from "@/lib/stores/auth.store";
import useCartStore, { CartItem } from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import CartItemCard from "../components/CartItemCard";

const CartPage = () => {
  const { user } = useAuthStore();
  const { cartItems, setTotalPricePaid } = useCartStore();
  const router = useRouter();

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

  const { total, subtotal, deliveryFee } = calculateTotals(cartItems);

  const handleCheckout = () => {
    if (!user) {
      router.push("/account/login");
    } else {
      setTotalPricePaid(total);
      router.push("/checkout");
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-[1000px] mx-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <h2 className="text-5xl font-bold mb-8">Cart is empty</h2>
              <Link href="/shop">
                <button className="flex items-center bg-primary text-white px-8 py-2 text-lg hover:bg-opacity-80">
                  <ShoppingCart size={18} className="mr-2" />
                  Go Shopping
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <h2 className="text-3xl font-bold">Cart</h2>
                <div className="ml-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-medium">
                  {cartItems.length}
                </div>
              </div>

              <div className="grid lg:grid-cols-6 gap-6 relative">
                <div className="lg:col-span-4 space-y-4 lg:pr-6 divide-y-1">
                  {cartItems.map((cartItem, i) => (
                    <CartItemCard key={i} cartItem={cartItem} />
                  ))}
                </div>
                <div className="lg:col-span-2 space-y-4 ">
                  <div className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] py-2 sticky top-48">
                    <h3 className="text-lg font-bold px-4">Cart Summary</h3>
                    <hr className="border-t border-gray-300 my-2" />
                    <div className="flex justify-between px-4 ">
                      <span>Subtotal</span>
                      <span className="font-bold">
                        {formatCurrency(subtotal, "NGN")}
                      </span>
                    </div>
                    <div className="flex justify-between px-4">
                      <span>Shipping</span>
                      <span className="font-bold">
                        {formatCurrency(deliveryFee, "NGN")}
                      </span>
                    </div>
                    <hr className="border-t border-gray-300 my-2" />
                    <div className="flex justify-between mb-3 px-4">
                      <span>Total</span>
                      <span className="font-bold">
                        {formatCurrency(total, "NGN")}
                      </span>
                    </div>
                    <hr className="border-t border-gray-300 my-2" />
                    <div className="px-4">
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-primary text-white py-2 shadow-md hover:bg-primary-dark transition"
                      >
                        Proceed to Checkout
                      </button>
                      <Link href="/shop">
                        <button className="w-full py-2 transition mt-2">
                          Continue Shopping
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default CartPage;
