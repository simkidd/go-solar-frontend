"use client";

import React, { useMemo } from "react";
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
import { useActiveBannersQuery } from "@/hooks/queries/useBannersQuery";

const DEFAULT_FALLBACK_SLIDES = [
  {
    _id: "default-1",
    image: "/images/bg/hero-bg.jpg",
    badge: "Commercial & Residential Deals",
    title: "Empower Your Home & Business With Solar Uptime",
    subtitle:
      "Get customized hybrid inverter setups and Lithium battery walls with comprehensive 5-year hardware warranties.",
    ctaText: "Configure Package",
    ctaLink: "/energy-calculator",
  },
  {
    _id: "default-2",
    image: "/images/bg/about-us.jpg",
    badge: "Tier-1 Certified Hardware",
    title: "High Efficiency Monocrystalline Solar Panels",
    subtitle:
      "Buy premium high-yield monocrystalline panels directly from certified manufacturers in Nigeria.",
    ctaText: "Shop Hardware",
    ctaLink: "/shop?category=solar-panels",
  },
  {
    _id: "default-3",
    image: "/images/bg/contact-bg-2.jpg",
    badge: "Flexible Starter Options",
    title: "Affordable Solar Energy Starting from ₦950k",
    subtitle:
      "Power your apartment or workspace with our Campus Lite package backup solutions.",
    ctaText: "View Offers",
    ctaLink: "/shop?category=packages",
  },
];

const highlightKeywords = (title: string) => {
  const keywords = ["Solar Uptime", "Solar Panels", "Solar Energy", "Clean Energy"];
  let rendered = title;
  for (const kw of keywords) {
    if (rendered.includes(kw)) {
      const parts = rendered.split(kw);
      return (
        <>
          {parts[0]}
          <span className="text-primary">{kw}</span>
          {parts[1]}
        </>
      );
    }
  }
  return title;
};

const Banner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  const { data: serverBanners = [], isLoading } = useActiveBannersQuery();

  const slides = useMemo(() => {
    const heroBanners = serverBanners.filter(
      (b: any) => b.placement === "storefront_hero"
    );
    if (heroBanners.length > 0) {
      return heroBanners;
    }
    return DEFAULT_FALLBACK_SLIDES;
  }, [serverBanners]);

  return (
    <div className="w-full relative rounded-[32px] overflow-hidden shadow-lg border border-zinc-150 dark:border-zinc-800/80 bg-zinc-950 font-inter">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem
              key={slide._id}
              className="relative w-full min-h-[380px] sm:min-h-[420px] md:min-h-[480px] flex items-center"
            >
              {/* Background slide image (positioned on right on large screens) */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 md:opacity-85 transition-transform duration-[10s] hover:scale-105"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              
              {/* Split layout gradient overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/95 via-black/85 md:from-black/95 md:via-black/75 md:to-transparent" />

              {/* Text Container: Align left in split layout */}
              <div className="relative z-20 w-[95%] sm:w-4/5 md:w-[65%] ml-6 sm:ml-12 md:ml-16 py-10 flex flex-col justify-center items-start space-y-4 text-white select-none">
                {slide.badge && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-primary text-white shadow-md">
                    <Sparkles className="h-3 w-3 animate-pulse text-amber-300" />
                    {slide.badge}
                  </span>
                )}
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight Outfit">
                  {highlightKeywords(slide.title)}
                </h2>
                
                {slide.subtitle && (
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium max-w-lg line-clamp-3">
                    {slide.subtitle}
                  </p>
                )}
                
                {/* Actions row: side by side buttons */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href={slide.ctaLink || "/shop"}>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl px-6 h-11 gap-2 transition-all hover:scale-[1.02] cursor-pointer">
                      {slide.ctaText || "Shop Now"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  
                  <Link href="/energy-calculator">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl px-6 h-11 transition-all hover:scale-[1.02] cursor-pointer">
                      Explore Solutions
                    </Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carousel arrows */}
        <CarouselPrevious className="hidden sm:flex hover:scale-110 transition-transform left-4 bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/20 text-white" />
        <CarouselNext className="hidden sm:flex hover:scale-110 transition-transform right-4 bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/20 text-white" />
      </Carousel>
    </div>
  );
};

export default Banner;
