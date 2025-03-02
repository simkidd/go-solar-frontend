"use client";
import useCartStore, { CartItem } from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartItemCard: React.FC<{ cartItem: CartItem }> = ({ cartItem }) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-[80px_auto] gap-4">
        <div className="size-20 rounded-md overflow-hidden">
          <Image
            src={cartItem?.product?.images[0]?.url}
            alt={cartItem?.product?.name}
            className="w-full h-full object-cover"
            width={70}
            height={70}
          />
        </div>
        <div className="w-full flex gap-1">
          <div className="w-3/4">
            <Link href={`/product/${cartItem?.product?.slug}`}>
              <h3 className="text-base font-bold">{cartItem.product.name}</h3>
            </Link>
            <p className="text-sm text-gray-600 text-ellipsis line-clamp-1 my-1">
              {cartItem.product.description}
            </p>
          </div>
          <div className="w-auto ms-auto">
            <p className="font-semibold">
              {formatCurrency(cartItem?.product?.price, "NGN")}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <button
          className="flex items-center text-red-500 hover:text-red-700 transition"
          onClick={() => removeItem(cartItem?.product?._id)}
        >
          <Trash size={16} className="mr-1" />
          Remove
        </button>
        <div className="flex items-center">
          <button
            className="disabled:text-gray-400 disabled:bg-opacity-50 disabled:cursor-not-allowed cursor-pointer h-8 w-8 flex items-center justify-center rounded-sm bg-primary text-white"
            onClick={() => decreaseQuantity(cartItem?.product?._id)}
            disabled={cartItem?.qty < 2}
          >
            <Minus size={18} />
          </button>
          <span className="px-4 text-sm">{cartItem?.qty}</span>
          <button
            className="h-8 w-8 flex items-center justify-center rounded-sm bg-primary text-white"
            onClick={() => increaseQuantity(cartItem?.product?._id)}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
