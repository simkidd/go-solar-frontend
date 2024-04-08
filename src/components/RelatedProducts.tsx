"use client";
import { Product } from "@/interfaces/product.interface";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";

import "swiper/css";

const RelatedProducts: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Swiper
      slidesPerView={2}
      spaceBetween={10}
      breakpoints={{
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
    >
      {[...Array(6)].map((item) => (
        <SwiperSlide key={item}>
          <ProductCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RelatedProducts;
