"use client";
import { Product } from "@/interfaces/product.interface";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";

import "swiper/css";
import { useProductStore } from "@/lib/stores/product.store";

const RelatedProducts: React.FC<{ product: Product }> = ({ product }) => {
  const { products } = useProductStore();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredProducts = products.filter(
          (p) =>
            p.category?._id === product.category?._id && p._id !== product._id
        );

        // Limit the number of related products
        const limitedRelatedProducts = filteredProducts.slice(0, 4);

        setRelatedProducts(limitedRelatedProducts);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchData();
  }, []);

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
      {relatedProducts.map((item, i) => (
        <SwiperSlide key={i}>
          <ProductCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default RelatedProducts;
