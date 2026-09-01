"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

const Banner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  );

  const { data: serverBanners = [], isLoading } = useActiveBannersQuery();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides = useMemo(() => {
    return serverBanners.filter(
      (b: any) => b.placement === "storefront_hero",
    );
  }, [serverBanners]);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading || slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative rounded-[32px] overflow-hidden shadow-lg border border-zinc-150 dark:border-zinc-800/80 bg-zinc-950 font-inter">
      <Carousel
        setApi={setApi}
        plugins={slides.length > 1 ? [plugin.current] : []}
        opts={{
          loop: slides.length > 1,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, idx) => {
            const content = (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title || "GoSolar Storefront Banner"}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  className="object-cover"
                />
              </div>
            );

            return (
              <CarouselItem
                key={slide._id || idx}
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

        {slides.length > 1 && (
          <>
            {/* Carousel arrows */}
            <CarouselPrevious className="hidden sm:flex left-4 bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/20 text-white" />
            <CarouselNext className="hidden sm:flex right-4 bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/20 text-white" />

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
          </>
        )}
      </Carousel>
    </div>
  );
};

export default Banner;
