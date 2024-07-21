"use client";
import { Product } from "@/interfaces/product.interface";
import { useViewHistoryStore } from "@/lib/stores/viewHistory.store";
import { formatCurrency } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard: React.FC<{
  item: Product;
}> = ({ item }) => {
  const { addProductToHistory } = useViewHistoryStore();

  const handleCardClick = () => {
    addProductToHistory(item);
  };

  return (
    <div className="w-full group">
      <Link href={`/product/${item?.slug}`} onClick={handleCardClick}>
        <div className="w-full lg:h-56 h-44 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full">
            <Image
              src={
                item?.images[0].url || "https://fakeimg.pl/300x300?font=noto"
              }
              alt="product image"
              width={300}
              height={300}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          {item?.images.length > 1 && (
            <div
              className="absolute top-0 left-0 w-full h-full z-[1] opacity-0 group-hover:opacity-100"
              style={{ transition: "opacity .5s ease-in-out" }}
            >
              <Image
                src={item?.images[1]?.url}
                alt="product image"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </Link>
      <div className="w-full py-2 ">
        <div>
          <span>{item?.currentOffer?.name}</span>
        </div>
        <Link
          href={`/product/${item?.slug}`}
          className="mb-2 text-sm text-ellipsis line-clamp-2"
          title={item?.name}
          onClick={handleCardClick}
        >
          {item?.name}
        </Link>
        <p className="font-semibold">{formatCurrency(item?.price, "NGN")}</p>
      </div>
      <div className="w-full px-2 flex justify-center mb-2">
        {/* <button className="bg-primary flex items-center gap-2 text-white px-4 py-2 text-sm">
          Add To Cart <TbShoppingCartPlus size={18} />
        </button> */}
      </div>
    </div>
  );
};

export default ProductCard;
