"use client";

import React, { useState } from "react";
import { Product } from "@/interfaces/product.interface";
import useCartStore from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Truck, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";


const ProductDetail: React.FC<{
  product: Product;
  productCode?: string | null;
}> = ({ product, productCode }) => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [liked, setLiked] = useState<boolean>(false);

  const calculateNewPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const hasOfferDiscount =
    Boolean(product?.currentOffer?.isActive && product?.currentOffer?.percentageOff);

  const hasDiscount =
    typeof product?.discountPrice === "number" &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const newPrice = hasDiscount ? product.discountPrice! : product?.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const inStock = product?.quantityInStock > 0;

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const shareData = {
        title: product?.name || "GoSolar Product",
        text: `Check out ${product?.name || "this product"} on GoSolar Nigeria!`,
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err: any) {
          // Ignore AbortError from user cancelling share sheet
          if (err.name !== "AbortError") {
            console.error("Error sharing:", err);
          }
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Product link copied to clipboard!");
        } catch (err) {
          toast.error("Failed to copy link.");
        }
      }
    }
  };

  return (
    <div className="w-full flex flex-col font-inter space-y-6">
      {/* ── Brand + Category Chips ── */}
      <div className="flex items-center gap-2 select-none">
        {product?.brand && (
          <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded-md">
            {product.brand}
          </span>
        )}
        {product?.category?.name && (
          <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-md">
            {product.category.name}
          </span>
        )}
      </div>

      {/* ── Title ── */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          {product?.name}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
          {product?.description || "High efficiency monocrystalline solar hardware component built to deliver reliable power."}
        </p>
      </div>

      {/* ── Stock status indicator ── */}
      <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4 select-none">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
          <span className={`text-xs font-bold ${inStock ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        {productCode && (
          <>
            <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600">
              SKU: {productCode}
            </span>
          </>
        )}
      </div>

      {/* ── Pricing Block ── */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-[#08AA08] dark:text-[#09bd09]">
          {formatCurrency(newPrice, "NGN")}
        </span>
        {product?.price > newPrice && (
          <span className="line-through text-zinc-400 text-sm font-bold">
            {formatCurrency(product?.price, "NGN")}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-500 text-white shadow-xs tracking-wider">
            {discountPercentage}% Off
          </span>
        )}
      </div>

      {/* ── Delivery Info Info ── */}
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs">
        <Truck size={15} className="text-primary" />
        <span className="font-semibold">
          Delivery fee: {formatCurrency(product?.withinLocationDeliveryFee || 0, "NGN")} (Within location)
        </span>
      </div>

      {/* ── Add to Cart & Counter ── */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 p-0.5 rounded-xl bg-zinc-50 dark:bg-zinc-900">
            <Button
              variant="ghost"
              size="icon"
              disabled={quantity <= 1 || !inStock}
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <Minus size={12} />
            </Button>
            <span className="px-3 text-xs font-bold text-zinc-800 dark:text-zinc-200 select-none">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={quantity >= product.quantityInStock || !inStock}
              onClick={() => {
                if (quantity < product.quantityInStock) setQuantity(quantity + 1);
              }}
              className="h-8 w-8 rounded-lg cursor-pointer"
            >
              <Plus size={12} />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={() => {
              if (inStock) {
                addItem({
                  product: {
                    ...product,
                    price: newPrice,
                  },
                  qty: quantity,
                  deliveryFee: product.withinLocationDeliveryFee || 0,
                });
              }
            }}
            disabled={!inStock}
            className="flex-1 bg-[#08AA08] hover:bg-[#079907] disabled:bg-zinc-100 disabled:text-zinc-400 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl h-10 cursor-pointer shadow-xs"
          >
            {inStock ? "Add To Cart" : "Out of Stock"}
          </Button>

          {/* Wishlist Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLiked(!liked)}
            className="border-zinc-200 dark:border-zinc-850 rounded-xl h-10 w-10 shrink-0 text-zinc-400 hover:text-rose-500 cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          </Button>
        </div>
      </div>

      {/* ── Social Share ── */}
      <div className="flex items-center gap-4 pt-4 border-t border-zinc-150 dark:border-zinc-850 select-none">
        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-650">Share Product:</span>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 border border-border text-zinc-700 dark:text-zinc-300 text-xs font-bold transition-all duration-200 cursor-pointer shadow-3xs"
        >
          <Share2 className="w-3.5 h-3.5 text-primary" />
          <span>Share Link</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
