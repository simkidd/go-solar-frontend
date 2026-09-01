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
import { ScrollArea } from "@/components/ui/scroll-area";
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
          className="rounded-full h-9 w-9 border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors relative"
        >
          <div className="relative">
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-primary text-white rounded-full text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center border-2 border-background ">
                {cartCount}
              </span>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col justify-between p-6 bg-card text-card-foreground border-l border-border/80">
        <div className="flex-1 flex flex-col min-h-0">
          <SheetHeader className="pb-4 border-b border-border/60">
            <SheetTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Shopping Cart
            </SheetTitle>
            <SheetDescription className="text-[10px] text-left uppercase font-bold text-muted-foreground tracking-wider mt-0.5">
              You have {cartCount} item{cartCount === 1 ? "" : "s"} in your cart
            </SheetDescription>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-3 ">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="text-xs font-black uppercase tracking-wider text-foreground">
                Your cart is empty
              </p>
              <p className="text-[10px] text-muted-foreground max-w-[200px]">
                Explore solar panels and clean energy kits to get started.
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-1 my-4 pr-3">
              <div className="divide-y divide-border/60">
                {cartItems.map((cartItem, idx) => (
                  <CartItemCard key={idx} cartItem={cartItem} />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="space-y-2 ">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground uppercase tracking-wider">
                  Subtotal
                </span>
                <span className="font-extrabold text-foreground">
                  {formatCurrency(
                    cartItems.reduce((acc, item) => {
                      const activePrice =
                        item.product.discountPrice &&
                        item.product.discountPrice > 0
                          ? item.product.discountPrice
                          : item.product.price;
                      return acc + activePrice * item.qty;
                    }, 0),
                    "NGN",
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground uppercase tracking-wider">
                  Delivery Fee
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  At Checkout
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Link href="/cart" className="flex-1">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full text-[10px] font-black uppercase tracking-wider rounded-full h-11 border-border hover:bg-muted cursor-pointer"
                  >
                    View Cart
                  </Button>
                </SheetClose>
              </Link>
              <Link href="/checkout" className="flex-1">
                <SheetClose asChild>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-wider rounded-full h-11 cursor-pointer shadow-xs">
                    Checkout
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
