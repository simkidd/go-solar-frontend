"use client";
import React, { useState } from "react";
import { Product } from "@/interfaces/product.interface";
import { useViewHistoryStore } from "@/lib/stores/viewHistory.store";
import { formatCurrency } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductCard: React.FC<{
  item: Product;
}> = ({ item }) => {
  const { addProductToHistory } = useViewHistoryStore();
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

  const hasOfferDiscount =
    Boolean(item?.currentOffer?.isActive && item?.currentOffer?.percentageOff);

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
    <div className="w-full group bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full font-inter">
      
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-950 shrink-0">
        <Link href={`/products/${item?.slug}`} onClick={handleCardClick} className="w-full h-full block">
          <Image
            src={item?.images[0]?.url || "https://fakeimg.pl/300x300?text=No+Image"}
            alt={item?.name}
            fill
            sizes="(max-w-768px) 50vw, (max-w-1200px) 25vw, 20vw"
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {item?.images?.length > 1 && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Image
                src={item?.images[1]?.url}
                alt={item?.name}
                fill
                sizes="(max-w-768px) 50vw, (max-w-1200px) 25vw, 20vw"
                className="object-cover"
              />
            </div>
          )}
        </Link>

        {/* Floating Stock & Discount Badges */}
        <div className="absolute top-3 left-3 z-[2] flex flex-col gap-1.5">
          {inStock ? (
            <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm tracking-wider">
              In Stock
            </span>
          ) : (
            <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-500 text-white shadow-sm tracking-wider">
              Out of Stock
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-sm tracking-wider">
              {discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs flex items-center justify-center text-zinc-500 hover:text-rose-500 shadow-sm transition-colors z-[2]"
        >
          <Heart className={`h-4.5 w-4.5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Content wrapper */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">
            <span>{item?.brand || "GoSolar"}</span>
            {item?.category?.name && (
              <span className="text-[#08AA08] bg-[#08AA08]/5 dark:bg-[#08AA08]/10 px-2 py-0.5 rounded-md">
                {item.category.name}
              </span>
            )}
          </div>
          <Link
            href={`/products/${item?.slug}`}
            className="text-sm font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2 hover:text-[#08AA08] transition-colors leading-snug block"
            title={item?.name}
            onClick={handleCardClick}
          >
            {item?.name}
          </Link>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
            {item?.description || "High efficiency monocrystalline hardware component built to deliver reliable power."}
          </p>
        </div>

        <div className="space-y-4 pt-3 border-t border-zinc-100 dark:border-zinc-850">
          {/* Price line */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-primary">
              {formatCurrency(newPrice, "NGN")}
            </span>
            {newPrice < item?.price && (
              <span className="line-through text-zinc-400 text-xs font-semibold">
                {formatCurrency(item?.price, "NGN")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link href={`/products/${item?.slug}`} onClick={handleCardClick}>
              <Button
                variant="outline"
                className="w-full text-xs font-bold rounded-xl h-9 border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                View Details
              </Button>
            </Link>
            <Link href={`/contact-us?subject=Quote&product=${encodeURIComponent(item?.name)}`}>
              <Button
                className="w-full text-xs font-bold rounded-xl h-9 bg-[#08AA08] hover:bg-[#079907] text-white shadow-xs transition-transform duration-200 hover:scale-[1.02]"
              >
                Get Quote
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
