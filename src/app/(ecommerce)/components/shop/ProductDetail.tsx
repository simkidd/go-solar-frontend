"use client";

import React, { useState } from "react";
import SocialShare from "@/components/SocialShare";
import { Product } from "@/interfaces/product.interface";
import useCartStore from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductDetail: React.FC<{
  product: Product;
  productCode?: string | null;
}> = ({ product, productCode }) => {
  const { addItem } = useCartStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryOption] = useState<"within" | "outside">("within");

  const selectedDeliveryFee =
    deliveryOption === "within"
      ? product?.withinLocationDeliveryFee
      : product?.outsideLocationDeliveryFee;

  const calculateNewPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const hasDirectDiscount =
    typeof product?.discountPrice === "number" &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const hasOfferDiscount =
    Boolean(product?.currentOffer?.isActive && product?.currentOffer?.percentageOff);

  const newPrice = hasDirectDiscount
    ? product.discountPrice!
    : hasOfferDiscount
      ? calculateNewPrice(product?.price, product?.currentOffer!.percentageOff)
      : product?.price;

  const discountPercentage = hasDirectDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : hasOfferDiscount
      ? product.currentOffer!.percentageOff
      : 0;

  return (
    <div className="w-full flex flex-col font-inter space-y-6">
      
      {/* Stars rating & stock status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`w-3.5 h-3.5 ${i < 4 ? "fill-amber-400" : "fill-zinc-200"}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-zinc-400 font-semibold">(12 Reviews)</span>
        </div>

        {/* Stock status badge */}
        <div className="text-xs font-bold">
          {product?.quantityInStock > 0 ? (
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40 text-[10px] font-extrabold uppercase tracking-wider">
              In Stock
            </span>
          ) : (
            <span className="text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/40 text-[10px] font-extrabold uppercase tracking-wider">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Product Titles */}
      <div className="space-y-2">
        <h2 className="font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight leading-tight">
          {product?.name}
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-medium">
          {product?.description || "High efficiency monocrystalline solar panels ideal for residential and commercial solar installations."}
        </p>
      </div>

      {/* Quantity & Add to Cart button */}
      <div className="flex items-center gap-3">
        {/* Quantity Selector */}
        <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 p-0.5 rounded-xl bg-zinc-50 dark:bg-zinc-900">
          <Button
            variant="ghost"
            size="icon"
            disabled={quantity <= 1}
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="h-8 w-8 rounded-lg"
          >
            <Minus size={12} />
          </Button>
          <span className="px-3 text-xs font-bold text-zinc-800 dark:text-zinc-255">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            disabled={quantity >= product.quantityInStock}
            onClick={() => {
              if (quantity < product.quantityInStock) setQuantity(quantity + 1);
            }}
            className="h-8 w-8 rounded-lg"
          >
            <Plus size={12} />
          </Button>
        </div>

      </div>

      {/* Pricing block */}
      <div className="flex items-center gap-3 pt-2">
        <h3 className="font-extrabold text-3xl tracking-tight text-zinc-900 dark:text-white">
          {formatCurrency(newPrice, "NGN")}
        </h3>
        {product?.price > newPrice && (
          <span className="line-through text-zinc-400 text-sm font-semibold">
            {formatCurrency(product?.price, "NGN")}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-xs tracking-wider">
            {discountPercentage}% Off
          </span>
        )}
      </div>

      {/* Action triggers */}
      <div className="space-y-3 pt-2">
        <Link href="/energy-calculator" className="w-full block">
          <Button className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl h-11 shadow-sm">
            Get Quote
          </Button>
        </Link>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              addItem({
                product: {
                  ...product,
                  price: newPrice,
                },
                qty: quantity,
                deliveryFee: selectedDeliveryFee || 0,
              });
              toast.success("Item added to cart!");
            }}
            variant="outline"
            className="flex-1 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl h-11 text-xs"
          >
            Add To Cart
          </Button>

          {/* Wishlist Button */}
          <Button variant="outline" size="icon" className="border-zinc-200 dark:border-zinc-800 rounded-xl h-11 w-11 shrink-0 text-zinc-400 hover:text-rose-500">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Button>
        </div>
      </div>



      {/* Free Delivery Promo Box */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/40 p-3.5 rounded-2xl flex items-start gap-2.5 text-emerald-850 dark:text-emerald-400 mt-2">
        <svg className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <div className="space-y-0.5">
          <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-350">Free Delivery</p>
          <p className="text-[10px] text-emerald-650 dark:text-emerald-450 font-bold">4-5 Working Days Nigeria Delivery</p>
        </div>
      </div>

      {/* Social Share links */}
      <div className="flex items-center gap-4 pt-4 border-t border-zinc-150 dark:border-zinc-850">
        <span className="text-xs font-bold text-zinc-400">Share:</span>
        <SocialShare />
      </div>

    </div>
  );
};

export default ProductDetail;
