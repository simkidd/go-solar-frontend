"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import useCartStore from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartItemCard from "./CartItemCard";

export const CartSheet = () => {
  const { cartItems } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 bg-zinc-50 border dark:bg-zinc-900"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col justify-between p-6">
        <div>
          <SheetHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <ShoppingCart className="h-5 w-5 text-[#08AA08]" />
              Your Shopping Cart
            </SheetTitle>
            <SheetDescription className="text-xs">
              You have {cartCount} item{cartCount === 1 ? "" : "s"} in your cart
            </SheetDescription>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <ShoppingCart className="h-10 w-10 text-zinc-350" />
              <p className="text-sm font-semibold text-zinc-500">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[60vh] pr-1 divide-y divide-zinc-100 dark:divide-zinc-800 py-4 scrollbar-thin">
              {cartItems.map((cartItem, idx) => (
                <CartItemCard key={idx} cartItem={cartItem} />
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-zinc-500">Subtotal</span>
              <span className="font-extrabold text-zinc-900 dark:text-white">
                {formatCurrency(
                  cartItems.reduce(
                    (acc, item) => acc + item.product.price * item.qty,
                    0,
                  ),
                  "NGN",
                )}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-zinc-500">
                Est. Tax & Delivery
              </span>
              <span className="text-xs text-zinc-400">
                Calculated at checkout
              </span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Link href="/cart" className="flex-1">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold rounded-xl h-11 border-zinc-200 dark:border-zinc-800"
                  >
                    View Detailed Cart
                  </Button>
                </SheetClose>
              </Link>
              <Link href="/checkout" className="flex-1">
                <SheetClose asChild>
                  <Button className="w-full bg-[#08AA08] hover:bg-[#079907] text-white text-xs font-bold rounded-xl h-11 shadow-xs">
                    Checkout Now
                  </Button>
                </SheetClose>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
export default CartSheet;
