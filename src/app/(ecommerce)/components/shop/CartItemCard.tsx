"use client";

import React from "react";
import useCartStore, { CartItem } from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";

const CartItemCard: React.FC<{ cartItem: CartItem }> = ({ cartItem }) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();

  return (
    <div className="w-full py-5 border-b border-border/60 first:pt-0">
      <div className="flex gap-4">
        {/* Item Image */}
        <div className="h-16 w-16 min-w-[64px] rounded-xl overflow-hidden border border-border/80 relative bg-muted shrink-0 ">
          <Image
            src={
              cartItem?.product?.images?.[0]?.url || "/placeholder-product.jpg"
            }
            alt={cartItem?.product?.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Item Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-0.5">
            <SheetClose asChild>
              <Link
                href={
                  !cartItem?.product?.category
                    ? `/packages/${cartItem?.product?.slug}`
                    : `/products/${cartItem?.product?.slug}`
                }
                className="group"
              >
                <h3 className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {cartItem.product.name}
                </h3>
              </Link>
            </SheetClose>
            <p className="text-[10px] text-muted-foreground line-clamp-1">
              {cartItem.product.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <p className="font-black text-xs text-primary">
              {formatCurrency(
                cartItem?.product?.discountPrice &&
                  cartItem?.product?.discountPrice > 0
                  ? cartItem.product.discountPrice
                  : cartItem?.product?.price,
                "NGN",
              )}
            </p>

            <div className="flex items-center gap-2">
              {/* Quantity actions */}
              {!cartItem?.product?.category ? (
                <span className="text-[11px] font-black text-muted-foreground  px-2.5 py-1 bg-muted/40 border border-border/40 rounded-lg">
                  Qty: 1
                </span>
              ) : (
                <div className="flex items-center gap-1.5 border border-border/80 p-0.5 rounded-lg bg-card ">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      cartItem.qty > 1 &&
                      decreaseQuantity(cartItem?.product?._id)
                    }
                    disabled={cartItem?.qty <= 1}
                    className="h-6 w-6 rounded-md hover:bg-muted"
                  >
                    <Minus className="h-2.5 w-2.5" />
                  </Button>
                  <span className="text-[11px] font-black text-foreground px-1">
                    {cartItem?.qty}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (cartItem.qty < cartItem.product.quantityInStock) {
                        increaseQuantity(cartItem?.product?._id);
                      }
                    }}
                    disabled={cartItem.qty >= cartItem.product.quantityInStock}
                    className="h-6 w-6 rounded-md hover:bg-muted"
                  >
                    <Plus className="h-2.5 w-2.5" />
                  </Button>
                </div>
              )}

              {/* Remove Action */}
              <button
                onClick={() => removeItem(cartItem?.product?._id)}
                className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer h-7 px-2 rounded-lg hover:bg-rose-500/5"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
