"use client";

import React, { Suspense } from "react";
import useCartStore, { CartItem } from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

const CartPage = () => {
  const {
    cartItems,
    setTotalPricePaid,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCartStore();
  const router = useRouter();

  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce(
      (acc, item) => {
        const activePrice = item.product.discountPrice && item.product.discountPrice > 0
          ? item.product.discountPrice
          : item.product.price;
        return acc + activePrice * item.qty;
      },
      0,
    );
    const deliveryFee = items.reduce(
      (acc, item) => acc + item.deliveryFee * item.qty,
      0,
    );
    const total = subtotal + deliveryFee;
    return { total, subtotal, deliveryFee };
  };

  const { total, subtotal, deliveryFee } = calculateTotals(cartItems);

  const handleCheckout = () => {
    setTotalPricePaid(total);
    router.push("/checkout");
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="w-full font-inter bg-white dark:bg-zinc-950 min-h-screen pb-16">
        {/* Hero Diagonal Stripes Banner */}
        <div className="w-full bg-[#08AA08] relative overflow-hidden py-16 flex flex-col justify-center items-center text-center text-white">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#079907_25%,transparent_25%,transparent_50%,#079907_50%,#079907_75%,transparent_75%,transparent)] bg-[length:40px_40px] opacity-25 z-0" />
          <h1 className="text-4xl font-extrabold tracking-tight relative z-10">
            Your Cart
          </h1>
        </div>

        <div className="container mx-auto px-6 mt-8 max-w-6xl space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
            <Link href="/shop" className="hover:underline">
              Store
            </Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-white">Cart</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
              <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Your Cart is Empty
                </h2>
                <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
                  Looks like you haven't added anything to your cart yet. Head
                  back to the store to configure your solar setups.
                </p>
              </div>
              <Link href="/shop">
                <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold rounded-xl gap-2 px-6">
                  Go Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">
                  Manage items
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left pane: Items lists & Shipping announcement */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {cartItems.map((cartItem) => (
                      <div
                        key={cartItem.product._id}
                        className="py-6 border-b border-zinc-100 dark:border-zinc-800/80 flex gap-4 sm:gap-6 items-start justify-between"
                      >
                        <div className="flex gap-4 sm:gap-6">
                          {/* Image */}
                          <div className="h-20 w-20 min-w-20 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-855 relative">
                            <Image
                              src={
                                cartItem.product.images?.[0]?.url ||
                                "/placeholder-product.jpg"
                              }
                              alt={cartItem.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="space-y-2">
                            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                              {cartItem.product.name}
                            </h3>

                            {/* Quantity buttons */}
                            {!cartItem.product.category ? (
                              <span className="inline-flex items-center mt-2 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-muted-foreground bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800 rounded-xl select-none">
                                Qty: 1
                              </span>
                            ) : (
                              <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800 rounded-xl w-fit p-1 select-none mt-1.5">
                                <button
                                  onClick={() => {
                                    if (cartItem.qty > 1) {
                                      decreaseQuantity(cartItem.product._id);
                                    }
                                  }}
                                  disabled={cartItem.qty <= 1}
                                  className="h-6 w-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-bold w-6 text-center text-zinc-800 dark:text-zinc-200">
                                  {cartItem.qty}
                                </span>
                                <button
                                  onClick={() => {
                                    if (
                                      cartItem.qty <
                                      (cartItem.product.quantityInStock || 10)
                                    ) {
                                      increaseQuantity(cartItem.product._id);
                                    }
                                  }}
                                  className="h-6 w-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price & Delete */}
                        <div className="flex items-center gap-4 shrink-0">
                          <p className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white">
                            {formatCurrency(
                              (cartItem.product.discountPrice && cartItem.product.discountPrice > 0
                                ? cartItem.product.discountPrice
                                : cartItem.product.price) * cartItem.qty,
                              "NGN",
                            )}
                          </p>
                          <button
                            onClick={() => removeItem(cartItem.product._id)}
                            className="text-zinc-400 hover:text-rose-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Banner indicator */}
                  <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-400">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-xs font-bold">
                        Standard Shipping Within Nigeria
                      </p>
                    </div>
                    <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      (4-5 Working Days)
                    </p>
                  </div>
                </div>

                {/* Right pane: Checkout details summaries */}
                <div className="lg:col-span-4">
                  {/* Summary card */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
                    <div className="space-y-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      <div className="flex justify-between items-center">
                        <span>Sub Total</span>
                        <span className="text-zinc-900 dark:text-white font-extrabold text-sm">
                          {formatCurrency(subtotal, "NGN")}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Shipping</span>
                        <span className="font-extrabold text-zinc-900 dark:text-white">
                          {deliveryFee > 0 ? (
                            formatCurrency(deliveryFee, "NGN")
                          ) : (
                            <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full px-2 py-0.5 text-[10px] font-extrabold">
                              Free
                            </span>
                          )}
                        </span>
                      </div>



                      <div className="flex justify-between items-center pt-4 border-t dark:border-zinc-800 text-sm font-extrabold text-zinc-900 dark:text-white">
                        <span>Total</span>
                        <span className="text-lg font-extrabold">
                          {formatCurrency(total, "NGN")}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3 pt-4 border-t dark:border-zinc-800">
                      <div className="grid ">
                        <Link href="/shop" className="w-full">
                          <Button
                            variant="outline"
                            className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl h-11 text-xs"
                          >
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>

                      <Button
                        variant="default"
                        onClick={handleCheckout}
                        className="w-full font-bold rounded-xl h-11 text-xs text-white"
                      >
                        Checkout
                      </Button>
                    </div>

                    {/* Good to Know Disclaimer */}
                    <div className="space-y-2 pt-4 border-t dark:border-zinc-800">
                      <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                        Good to know
                      </h4>
                      <h5 className="text-[11px] font-bold text-zinc-900 dark:text-white">
                        This Product Requires Installation
                      </h5>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Get this product as part of a complete solar setup that
                        includes panels, batteries, and expert installation all
                        optimized for performance and savings. Installation is
                        completely free.{" "}
                        <Link
                          href="/energy-calculator"
                          className="text-zinc-950 dark:text-white font-bold hover:underline inline-flex items-center gap-0.5"
                        >
                          Get Quote <span className="text-[8px]">↗</span>
                        </Link>{" "}
                        to see what's included.
                      </p>
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
