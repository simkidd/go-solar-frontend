"use client";
import Image from "next/image";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { Autoplay, Pagination } from "swiper/modules";
import { TeamQuotes } from "@/data/team";
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
      {TeamQuotes.map(({ name, quote, role, imageUrl }, i) => (
        <SwiperSlide key={i} className="py-8">
          <div className="lg:px-12 px-2 py-8 light bg-[#f1f1f1] dark:bg-[#2a2b2f]">
            <div className="mb-4 text-primary">
              <BiSolidQuoteAltRight size={50} />
            </div>
            <div className="mb-4 pl-4 border-l-4 border-l-primary">
              <h4 className="text-2xl">Your Journey to Solar Starts Here:</h4>
            </div>
            <p className="mb-8">{quote}</p>
            <div className="flex items-center">
              <div className="rounded-full size-12 bg-gray-500 mr-4 overflow-hidden">
                <Image src={imageUrl} alt="author image" />
              </div>
              <div className="flex flex-col">
                <h6 className="text-lg text-primary leading-snug font-semibold">
                  {name}
                </h6>
                <p className="text-sm">{role}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default TeamQuote;
