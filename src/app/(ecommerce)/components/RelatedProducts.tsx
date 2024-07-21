"use client";
import { Product } from "@/interfaces/product.interface";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import { useProductStore } from "@/lib/stores/product.store";

import "swiper/css";

const RelatedProducts: React.FC<{ product: Product }> = ({ product }) => {
  const { products } = useProductStore();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const publishedProducts = products.filter(
          (product) => product.isPublished
        );
        const filteredProducts = publishedProducts.filter(
          (p) =>
            p.category?._id === product.category?._id && p._id !== product._id
        );

        // Limit the number of related products
        const limitedRelatedProducts = filteredProducts.slice(0, 8);

        setRelatedProducts(limitedRelatedProducts);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {relatedProducts && relatedProducts.length > 1 && (
        <div className="w-full">
          <div className=" bg-primary text-white px-4 py-2">
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
                  slidesPerView: 6,
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
      )}
    </>
  );
};

export default RelatedProducts;
