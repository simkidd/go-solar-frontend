"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const Banner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  const slides = [
    {
      image: "/images/bg/hero-bg.jpg",
      badge: "Commercial & Residential Deals",
      title: "Empower Your Home & Business With Solar Uptime",
      desc: "Get customized hybrid inverter setups and Lithium battery walls with comprehensive 5-year hardware warranties.",
      cta: "Configure Package",
      link: "/energy-calculator",
    },
    {
      image: "/images/bg/about-us.jpg",
      badge: "Tier-1 Certified Hardware",
      title: "High Efficiency Monocrystalline Solar Panels",
      desc: "Buy premium high-yield monocrystalline panels directly from certified manufacturers in Nigeria.",
      cta: "Shop Hardware",
      link: "/shop?category=solar-panels",
    },
    {
      image: "/images/bg/contact-bg-2.jpg",
      badge: "Flexible Starter Options",
      title: "Affordable Solar Energy Starting from ₦950k",
      desc: "Power your apartment or workspace with our Campus Lite package backup solutions.",
      cta: "View Offers",
      link: "/shop?category=packages",
    },
  ];

  return (
    <div className="w-full relative rounded-3xl overflow-hidden shadow-md border border-zinc-150 dark:border-zinc-800 bg-zinc-950 font-inter">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative w-full aspect-[21/9] min-h-[300px] sm:min-h-[360px] md:min-h-[400px]">
              {/* Background slide image */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 transition-transform duration-10000 hover:scale-105"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              {/* Text content block */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 sm:px-16 md:px-20 max-w-xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#08AA08]/90 text-white shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  {slide.badge}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium line-clamp-2 sm:line-clamp-none">
                  {slide.desc}
                </p>
                <div className="pt-2">
                  <Link href={slide.link} className="inline-block">
                    <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-widest rounded-full px-6 h-10 gap-1.5 hover:scale-105 transition-all shadow-md">
                      {slide.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carousel buttons */}
        <CarouselPrevious className="hidden sm:flex hover:scale-110 transition-transform" />
        <CarouselNext className="hidden sm:flex hover:scale-110 transition-transform" />
      </Carousel>
    </div>
  );
};

export default Banner;
