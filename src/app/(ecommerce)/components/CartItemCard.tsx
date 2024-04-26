"use client";
import useCartStore, { CartItem } from "@/lib/stores/useCart";
import { formatCurrency } from "@/utils/helpers";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartItemCard: React.FC<{ cartItem: CartItem }> = ({ cartItem }) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();

  return (
    <div className="w-full p-4 grid grid-cols-[80px_auto] gap-4">
      <div className="size-20">
        <Image
          src={cartItem?.product?.images[0]?.url}
          alt={cartItem?.product?.name}
          className="w-full h-full object-cover"
          width={70}
          height={70}
        />
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4 gap-6">
          <Link href={`/product/${cartItem?.product?._id}`}>
            <p className="">{cartItem?.product?.name}</p>
          </Link>
          <button
            className="self-start"
            onClick={() => removeItem(cartItem?.product?._id)}
          >
            <Trash size={18} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <button
              className="disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => decreaseQuantity(cartItem?.product?._id)}
              disabled={cartItem?.qty < 2}
            >
              <MinusCircle />
            </button>
            <p className="text-body-bold">{cartItem?.qty}</p>
            <PlusCircle
              className="hover:text-red-1 cursor-pointer"
              onClick={() => increaseQuantity(cartItem?.product?._id)}
            />
          </div>

          <p className="">{formatCurrency(cartItem?.product?.price, "NGN")}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
