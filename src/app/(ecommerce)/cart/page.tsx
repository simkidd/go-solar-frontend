"use client";
import { useAuth } from "@/contexts/auth.context";
import useCartStore, { CartItem } from "@/lib/stores/useCart";
import { formatCurrency } from "@/utils/helpers";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartItemCard from "../components/CartItemCard";

const CartPage = () => {
  const { cartItems, setTotalPricePaid } = useCartStore();
  const router = useRouter();
  const { currentUser } = useAuth();

  const calculateTotals = (cartItems: CartItem[]) => {
    let subtotal = 0;
    let deliveryFee = 0;

    cartItems.forEach((cartItem) => {
      subtotal += cartItem.product.price * cartItem.qty;
      deliveryFee += cartItem.product.withinLocationDeliveryFee;
    });

    const total = subtotal + deliveryFee;
    return { total, subtotal, deliveryFee };
  };

  const { total, subtotal, deliveryFee } = calculateTotals(cartItems);

  // const subtotal = cartItems.reduce(
  //   (acc, cartItem) => acc + cartItem.product.price * cartItem.quantity,
  //   0
  // );

  // const deliveryFee =

  // const totalRounded = parseFloat(total.toFixed(2));

  const handleCheckout = () => {
    if (!currentUser) {
      router.push("/account/login");
    } else {
      setTotalPricePaid(total);
      router.push("/shipping");
    }
  };

  return (
    <div className="container mx-auto px-2 py-16">
      <div className="max-w-[1000px] mx-auto px-2">
        {cartItems?.length < 1 ? (
          <div className="w-full min-h-[60vh] flex items-center justify-center flex-col">
            <h2 className="font-bold text-5xl mb-8">Cart is empty</h2>

            <Link href="/shop">
              <button className="bg-primary px-8 py-2 text-white text-lg flex items-center">
                <ShoppingCart size={18} className="mr-2" /> Go Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-4 gap-2">
              <h2 className="font-bold text-3xl">Cart </h2>
              <div className="rounded-full w-8 h-8 flex items-center justify-center bg-primary text-white text-lg font-medium">
                {cartItems?.length}
              </div>
            </div>

            <div className="grid lg:grid-cols-5 grid-cols-1 gap-6">
              <div className="lg:col-span-3 col-span-1 lg:border-r-1 border-r-gray-400 lg:pr-6 border-b-1 lg:border-b-0 pb-4">
                {cartItems.map((cartItem, i) => (
                  <CartItemCard key={i} cartItem={cartItem} />
                ))}
              </div>
              <div className="lg:col-span-2 col-span-1">
                <p className="font-bold flex items-center justify-between mb-1">
                  Subtotal:
                  <span className=" font-dmsans">
                    {formatCurrency(subtotal, "NGN")}
                  </span>
                </p>
                <p className="font-bold flex items-center justify-between mb-1">
                  Delivery fee:
                  <span className=" font-dmsans">
                    {formatCurrency(deliveryFee, "NGN")}
                  </span>
                </p>
                <p className="font-bold flex items-center justify-between mb-3">
                  Total:
                  <span className="font-bold font-dmsans ">
                    {formatCurrency(total, "NGN")}
                  </span>
                </p>
                <button
                  onClick={handleCheckout}
                  className="bg-primary px-8 py-2 text-white"
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
