"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  id: number;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  image: string;
  imageAlt: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 1,
    titleLine1: "Power Your Home Today,",
    titleLine2: "Pay in Easy Installments",
    subtitle:
      "Break free from high electricity bills and noisy fuel generators with flexible, low-deposit financing plans tailored for Nigerian homes and businesses.",
    primaryCtaText: "Explore Financing",
    primaryCtaLink: "#financing",
    image: "/images/bg/hero-slide-financing.jpg",
    imageAlt: "Solar financing and clean energy installation",
  },
  {
    id: 2,
    titleLine1: "Tier-1 Hybrid Packages &",
    titleLine2: "Lithium Battery Storage",
    subtitle:
      "Pre-configured turnkey solar systems featuring smart hybrid inverters, monocrystalline panels, and ultra-durable LiFePO4 batteries with full warranty.",
    primaryCtaText: "View Packages",
    primaryCtaLink: "#packages",
    image: "/images/bg/hero-slide-packages.jpg",
    imageAlt: "Solar packages and lithium battery products",
  },
  {
    id: 3,
    titleLine1: "Precision Energy Calculator",
    titleLine2: "for Your Exact Load",
    subtitle:
      "Avoid underpowering or overspending. Input your household appliances to get an instant, custom-engineered sizing breakdown for your setup.",
    primaryCtaText: "Calculate Your Load",
    primaryCtaLink: "/energy-calculator",
    image: "/images/bg/hero-slide-calculator.jpg",
    imageAlt: "Smart solar load calculation and sizing",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <section
      className="relative w-full h-dvh flex items-center overflow-hidden border-b border-zinc-900 select-none bg-zinc-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Images Crossfade ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Directional Scrim Overlay (ensures maximum text readability while keeping the image visible on the right) */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/65 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* ── Foreground Text Content ── */}
      <div className="container relative z-10 mx-auto px-6 max-w-7xl py-16 lg:py-20 flex flex-col justify-center">
        <div className="max-w-2xl text-left">
          {/* Stable Content Box (prevents any vertical layout shift) */}
          <div className="relative w-full min-h-[260px] sm:min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Clean Solid Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] text-white">
                  {slide.titleLine1}{" "}
                  <span className="text-primary block mt-1">
                    {slide.titleLine2}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-zinc-200 leading-relaxed max-w-xl font-normal">
                  {slide.subtitle}
                </p>

                {/* Single CTA Button */}
                <div className="pt-2">
                  <Link href={slide.primaryCtaLink} className="inline-block">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm h-12 px-7 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all duration-200">
                      {slide.primaryCtaText}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Slide Navigation Controls ── */}
          <div className="flex items-center gap-4 pt-6 mt-6 border-t border-white/15 max-w-md">
            {/* Slide Dots / Indicators */}
            <div className="flex items-center gap-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="p-1 cursor-pointer focus:outline-none"
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx
                        ? "w-8 bg-primary"
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="h-9 w-9 rounded-lg bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="h-9 w-9 rounded-lg bg-black/40 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
