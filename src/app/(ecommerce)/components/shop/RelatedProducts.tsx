"use client";
import React from "react";
import { Product } from "@/interfaces/product.interface";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import { usePublishedProductsQuery } from "@/hooks/queries/useProductsQuery";
import "swiper/css";

const RelatedProducts: React.FC<{ product: Product }> = ({ product }) => {
  const { data: publishedProducts = [] } = usePublishedProductsQuery();

  const relatedProducts = publishedProducts
    .filter(
      (p) =>
        p.category?._id === product.category?._id && p._id !== product._id
    )
    .slice(0, 8);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="w-full">
      <div className="bg-primary text-white px-4 py-2 rounded-t-xl">
        <h3 className="font-medium lg:text-xl text-lg">
          You may also like
        </h3>
      </div>

      <div className="my-6">
        <Swiper
          slidesPerView={2}
          spaceBetween={16}
          slidesPerGroup={1}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {relatedProducts.map((item) => (
            <SwiperSlide key={item?._id}>
              <ProductCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedProducts;
