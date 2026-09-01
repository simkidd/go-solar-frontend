"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useActiveBannersQuery } from "@/hooks/queries/useBannersQuery";

const DEFAULT_FALLBACK_SLIDES = [
  {
    _id: "default-1",
    image: "/images/bg/hero-bg.jpg",
    ctaLink: "/energy-calculator",
  },
  {
    _id: "default-2",
    image: "/images/bg/about-us.jpg",
    ctaLink: "/shop?category=solar-panels",
  },
  {
    _id: "default-3",
    image: "/images/bg/contact-bg-2.jpg",
    ctaLink: "/shop?category=packages",
  },
];

const Banner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  );

  const { data: serverBanners = [] } = useActiveBannersQuery();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides = useMemo(() => {
    const heroBanners = serverBanners.filter(
      (b: any) => b.placement === "storefront_hero",
    );
    if (heroBanners.length > 0) {
      return heroBanners;
    }
    return DEFAULT_FALLBACK_SLIDES;
  }, [serverBanners]);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full relative rounded-[32px] overflow-hidden shadow-lg border border-zinc-150 dark:border-zinc-800/80 bg-zinc-950 font-inter">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => {
            const content = (
              <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105 opacity-100"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
            );

            return (
              <CarouselItem
                key={slide._id}
                className="relative w-full min-h-[380px] sm:min-h-[420px] md:min-h-[480px] flex items-center overflow-hidden"
              >
                {slide.ctaLink ? (
                  <Link
                    href={slide.ctaLink}
                    className="absolute inset-0 w-full h-full z-20"
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* Carousel arrows */}
        <CarouselPrevious className="hidden sm:flex hover:scale-110 transition-transform left-4 bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/20 text-white" />
        <CarouselNext className="hidden sm:flex hover:scale-110 transition-transform right-4 bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/20 text-white" />

        {/* Pagination Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
