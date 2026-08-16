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

  const hasDirectDiscount =
    typeof item?.discountPrice === "number" &&
    item.discountPrice > 0 &&
    item.discountPrice < item.price;

  const hasOfferDiscount = Boolean(
    item?.currentOffer?.isActive && item?.currentOffer?.percentageOff,
  );

  const newPrice = hasDirectDiscount
    ? item.discountPrice!
    : hasOfferDiscount
      ? calculateNewPrice(item?.price, item?.currentOffer!.percentageOff)
      : item?.price;

  const discountPercentage = hasDirectDiscount
    ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
    : hasOfferDiscount
      ? item.currentOffer!.percentageOff
      : 0;

  const inStock = item?.quantityInStock > 0;

  return (
    <div className="w-full group bg-card text-card-foreground border border-border/80 rounded-3xl overflow-hidden hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.01] transition-all duration-300 flex flex-col h-full font-inter">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-muted shrink-0">
        <Link
          href={`/products/${item?.slug}`}
          onClick={handleCardClick}
          className="w-full h-full block"
        >
          {item?.images?.length > 0 ? (
            <>
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
              {/* Hover swap to second image */}
              {inStock && item.images.length > 1 && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Image
                    src={item.images[1].url}
                    alt={item?.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/40 select-none">
              <ImageOff className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">
                No image
              </p>
            </div>
          )}
        </Link>

        {/* Discount Badge — only when on sale */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-[2] select-none">
            <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-xs tracking-wider">
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
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground select-none">
            <span>{item?.brand || "GoSolar"}</span>
            {item?.category?.name && (
              <span className="text-primary bg-primary/5 dark:bg-primary/10 px-2 py-0.5 rounded-md">
                {item.category.name}
              </span>
            )}
          </div>
          <Link
            href={`/products/${item?.slug}`}
            className="text-xs sm:text-sm font-extrabold text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug block"
            title={item?.name}
            onClick={handleCardClick}
          >
            {item?.name}
          </Link>
          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
            {item?.description ||
              "High efficiency monocrystalline hardware component built to deliver reliable power."}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-border/60">
          {/* Price line */}
          <div className="flex items-baseline gap-1.5 select-none">
            <span className="text-sm sm:text-base font-black text-primary">
              {formatCurrency(newPrice, "NGN")}
            </span>
            {newPrice < item?.price && (
              <span className="line-through text-muted-foreground text-[10px] font-semibold">
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
            className={`w-full text-[10px] font-black uppercase tracking-wider rounded-xl h-9 cursor-pointer transition-all duration-200 ${
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
