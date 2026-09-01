"use client";

import React, { useState } from "react";
import { Product } from "@/interfaces/product.interface";
import { useViewHistoryStore } from "@/lib/stores/viewHistory.store";
import useCartStore from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductCard: React.FC<{
  item: Product;
}> = ({ item }) => {
  const { addProductToHistory } = useViewHistoryStore();
  const { addItem } = useCartStore();
  const [liked, setLiked] = useState(false);

  const handleCardClick = () => {
    addProductToHistory(item);
  };

  const calculateNewPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const hasOfferDiscount = Boolean(
    item?.currentOffer?.isActive && item?.currentOffer?.percentageOff,
  );

  const hasDiscount =
    typeof item?.discountPrice === "number" &&
    item.discountPrice > 0 &&
    item.discountPrice < item.price;

  const newPrice = hasDiscount ? item.discountPrice! : item?.price;

  const discountPercentage = hasDiscount
    ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
    : 0;

  const inStock = item?.quantityInStock > 0;

  return (
    <div className="w-full group bg-card text-card-foreground border border-zinc-100 dark:border-zinc-800/80 rounded-3xl overflow-hidden hover:border-primary/20 hover:shadow-xs transition-all duration-300 flex flex-col h-full font-inter">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-900/10 shrink-0 border-b border-zinc-100 dark:border-zinc-800/40">
        <Link
          href={`/products/${item?.slug}`}
          onClick={handleCardClick}
          className="w-full h-full block flex items-center justify-center bg-white dark:bg-zinc-950"
        >
          {item?.images?.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={item.images[0].url}
                alt={item?.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                loading="lazy"
                className={`object-cover group-hover:scale-105 transition-transform duration-500 ${!inStock ? "grayscale brightness-75" : ""}`}
              />
              {/* Out of Stock overlay */}
              {!inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
              {/* Hover swap to second image */}
              {inStock && item.images.length > 1 && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white dark:bg-zinc-950">
                  <Image
                    src={item.images[1].url}
                    alt={item?.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 ">
              <ImageOff className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">
                No image
              </p>
            </div>
          )}
        </Link>

        {/* Discount Badge — only when on sale */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-[2] ">
            <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-primary text-white shadow-xs tracking-wider">
              {discountPercentage}% Off
            </span>
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-xs flex items-center justify-center text-muted-foreground hover:text-rose-500 border border-border/40 shadow-xs transition-colors z-[2] cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </button>
      </div>

      {/* Content wrapper */}
      <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 space-y-3 sm:space-y-4">
        <div className="space-y-2">
          {/* Brand & Category Tags */}
          {/* <div className="flex flex-wrap justify-between items-center gap-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground ">
            <span>{item?.brand || "GoSolar"}</span>
            {item?.category?.name && (
              <span className="text-primary bg-primary/5 dark:bg-primary/10 px-1.5 py-0.5 rounded-md truncate max-w-[80px] sm:max-w-none">
                {item.category.name}
              </span>
            )}
          </div> */}

          {/* Product Title */}
          <Link
            href={`/products/${item?.slug}`}
            className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug block pt-0.5 capitalize"
            title={item?.name}
            onClick={handleCardClick}
          >
            {item?.name}
          </Link>
        </div>

        <div className="space-y-2.5 sm:space-y-3 pt-2.5 sm:pt-3 border-t border-border/60">
          {/* Price line */}
          <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5 ">
            <span className="text-xs sm:text-base font-black text-primary">
              {formatCurrency(newPrice, "NGN")}
            </span>
            {newPrice < item?.price && (
              <span className="line-through text-muted-foreground text-[9px] sm:text-[10px] font-semibold">
                {formatCurrency(item?.price, "NGN")}
              </span>
            )}
          </div>

          {/* Cart Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (inStock) {
                addItem({
                  product: item,
                  qty: 1,
                  deliveryFee: item.withinLocationDeliveryFee || 0,
                });
              }
            }}
            disabled={!inStock}
            className={`w-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-xl py-2 h-8 sm:h-9.5 cursor-pointer transition-all duration-200 ${
              inStock
                ? "bg-primary hover:bg-primary/90 text-white shadow-xs"
                : "bg-muted text-muted-foreground cursor-not-allowed border border-border/80"
            }`}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
