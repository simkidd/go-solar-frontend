"use client";
import Image from "next/image";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const TeamQuote = () => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      modules={[Autoplay, Pagination]}
      navigation={true}
      pagination={{ dynamicBullets: true }}
      loop={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
    >
      {[...Array(3)].map((_, i) => (
        <SwiperSlide key={i} className="py-8">
          <div className="lg:px-12 px-2 py-8 light bg-[#f1f1f1] dark:bg-[#2a2b2f]">
            <div className="mb-4 text-primary">
              <BiSolidQuoteAltRight size={50} />
            </div>
            <div className="mb-4 pl-4 border-l-4 border-l-primary">
              <h4 className="text-2xl">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Molestias, doloremque.
              </h4>
            </div>
            <p className="mb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              aliquam eveniet veniam nihil fugit molestias sit ex, maiores eius
              fuga hic dolorum aspernatur! Totam repudiandae esse, veritatis
              doloremque impedit vitae?
            </p>
            <div className="flex items-center">
              <div className="rounded-full size-12 bg-gray-500 mr-4 overflow-hidden">
                <Image src="" alt="author image" />
              </div>
              <div className="flex flex-col">
                <h6 className="text-lg text-primary leading-snug font-semibold">
                  Adrian Javier
                </h6>
                <p className="text-sm">Project Manager</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TeamQuote;
