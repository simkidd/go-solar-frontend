"use client";
import { useEffect, useState } from "react";
import { useViewHistoryStore } from "@/lib/stores/viewHistory.store";
import ProductCard from "./shop/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { History } from "lucide-react";

import "swiper/css";

const ViewHistoryComp = () => {
  const [mounted, setMounted] = useState(false);
  const { viewHistory } = useViewHistoryStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const publishedViewedProduct = viewHistory.filter(
    (product) => product?.isPublished,
  );

  return (
    <>
      {publishedViewedProduct && publishedViewedProduct.length > 0 && (
        <section className="w-full mt-10 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 transition-colors duration-300">
                <History className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Your Recently Viewed
                </h3>
                <p className="text-xs text-muted-foreground select-none">
                  Items you have browsed recently
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
              {publishedViewedProduct.slice(0, 6).map((product) => (
                <SwiperSlide key={product?._id} className="h-auto">
                  <ProductCard item={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
    </>
  );
};

export default ViewHistoryComp;
