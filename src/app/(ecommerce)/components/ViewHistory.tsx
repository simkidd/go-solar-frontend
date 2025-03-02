"use client";
import { useViewHistoryStore } from "@/lib/stores/viewHistory.store";
import ProductCard from "./shop/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const ViewHistoryComp = () => {
  const { viewHistory } = useViewHistoryStore();

  const publishedViewedProduct = viewHistory.filter(
    (product) => product?.isPublished
  );

  return (
    <>
      {viewHistory && viewHistory.length > 0 && (
        <div className="w-full">
          <div className=" bg-primary text-white px-4 py-2">
            <h3 className="font-medium lg:text-xl text-lg">
              Your Recently Viewed
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
              {publishedViewedProduct.slice(0, 6).map((product) => (
                <SwiperSlide key={product?._id}>
                  <ProductCard item={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewHistoryComp;
