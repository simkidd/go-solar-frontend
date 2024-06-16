"use client";
import React from "react";
import banner1 from "@/assets/images/G33333333333.jpg";
import banner2 from "@/assets/images/G33jpg.jpg";
import banner3 from "@/assets/images/G22.jpg";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "@/styles/banner.scss";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const Banner = () => {
  const bannerImages = [banner1, banner2, banner3];

  return (
    <div className="w-full lg:h-[400px] md:h-[300px] h-[300px]">
      <div className="w-full h-full grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 w-full h-full lg:pr-2 overflow-hidden">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            navigation={true}
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect={"fade"}
          >
            {bannerImages.map((banner, i) => (
              <SwiperSlide key={i}>
                <div className="bg-gray-500 w-full lg:h-[400px] md:h-[300px] h-[300px]">
                  <Image
                    src={banner.src}
                    alt="main banner"
                    width={banner.width}
                    height={banner.height}
                    className="object-cover w-full h-full"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="col-span-4 w-full lg:h-[400px] md:h-[300px] h-[300px] lg:flex flex-col pl-2 gap-4 hidden">
          <div className="h-full w-full bg-gray-500 box-border overflow-hidden">
            <Image
              src={banner2.src}
              alt=""
              width={banner2.width}
              height={banner2.height}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="h-full w-full bg-gray-500 box-border overflow-hidden">
            <Image
              src={banner3.src}
              alt=""
              width={banner3.width}
              height={banner3.height}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
