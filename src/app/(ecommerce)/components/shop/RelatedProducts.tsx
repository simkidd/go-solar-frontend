"use client";
import React from "react";
import { Product } from "@/interfaces/product.interface";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import { usePublishedProductsQuery } from "@/hooks/queries/useProductsQuery";
import { ShoppingBag } from "lucide-react";
import "swiper/css";

const RelatedProducts: React.FC<{ product: Product }> = ({ product }) => {
  const { data: productsRes, isLoading } = usePublishedProductsQuery({
    page: 1,
    limit: 12,
    category: product.category?._id,
  });

  const publishedProducts = productsRes?.products || [];

  const relatedProducts = publishedProducts
    .filter((p) => p._id !== product._id)
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="w-full space-y-6 mt-10 ">
        <div className="flex items-center gap-2.5 border-b border-zinc-200/80 dark:border-zinc-800/60 pb-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
            <ShoppingBag className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg lg:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              You May Also Like
            </h3>
            <p className="text-xs text-muted-foreground">
              Recommended products in this category
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-72 bg-zinc-50 dark:bg-zinc-900 border border-border rounded-3xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) return null;

  return (
    <section className="w-full mt-10 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/60 pb-3 ">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 transition-colors duration-300">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg lg:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              You May Also Like
            </h3>
            <p className="text-xs text-muted-foreground">
              Recommended products in this category
            </p>
          </div>
        </div>
      </div>

      <div className="relative group/swiper">
        <Swiper
          slidesPerView={2}
          spaceBetween={20}
          slidesPerGroup={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="py-1"
        >
          {relatedProducts.map((item) => (
            <SwiperSlide key={item?._id} className="h-auto">
              <ProductCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RelatedProducts;
