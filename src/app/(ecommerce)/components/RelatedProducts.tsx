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
      slidesPerGroup={1}
      breakpoints={{
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 6,
        },
      }}
    >
      {[...Array(10)].map((item, i) => (
        <SwiperSlide key={i}>
          <ProductCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RelatedProducts;
