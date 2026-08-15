"use client";
import React from "react";
import useCartStore, { CartItem } from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CartItemCard: React.FC<{ cartItem: CartItem }> = ({ cartItem }) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();

  return (
    <div className="w-full py-6 border-b border-zinc-100 dark:border-zinc-800/80 first:pt-0">
      <div className="flex gap-4 sm:gap-6">
        
        {/* Item Image */}
        <div className="h-20 w-20 min-w-20 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 relative bg-zinc-50 dark:bg-zinc-900">
          <Image
            src={cartItem?.product?.images?.[0]?.url || "/placeholder-product.jpg"}
            alt={cartItem?.product?.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Item Details */}
        <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
            <Link href={`/products/${cartItem?.product?.slug}`} className="group">
              <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white group-hover:text-primary transition-colors">
                {cartItem.product.name}
              </h3>
            </Link>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2 max-w-md">
              {cartItem.product.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
            {/* Price */}
            <p className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white">
              {formatCurrency(cartItem?.product?.price, "NGN")}
            </p>

            {/* Quantity actions */}
            <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 p-0.5 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => cartItem.qty > 1 && decreaseQuantity(cartItem?.product?._id)}
                disabled={cartItem?.qty <= 1}
                className="h-7 w-7 rounded-md"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 px-1">{cartItem?.qty}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (cartItem.qty < cartItem.product.quantityInStock) {
                    increaseQuantity(cartItem?.product?._id);
                  }
                }}
                disabled={cartItem.qty >= cartItem.product.quantityInStock}
                className="h-7 w-7 rounded-md"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Remove Action */}
            <button
              onClick={() => removeItem(cartItem?.product?._id)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition flex items-center gap-1 mt-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartItemCard;
