"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { Sun, BatteryCharging, TrendingUp } from "lucide-react";

interface Slide {
  tag: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const slides: Slide[] = [
  {
    tag: "Clean Energy Initiative",
    icon: <Sun className="h-3.5 w-3.5 text-emerald-300" />,
    title: "Powering Nigeria with Reliable, Affordable Solar",
    desc: "Join thousands of homeowners and businesses switching to modern solar power, saving up to 75% on electricity costs every single month.",
  },
  {
    tag: "Zero Outages",
    icon: <BatteryCharging className="h-3.5 w-3.5 text-emerald-300" />,
    title: "Say Goodbye to Grid Failures & Diesel Noise",
    desc: "Our advanced hybrid solar systems automatically switch power sources instantly, giving you uninterrupted clean energy day and night.",
  },
  {
    tag: "Instant Returns",
    icon: <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />,
    title: "An Investment That Pays for Itself",
    desc: "With solar power, your monthly savings pay back the installation cost in just a few years, adding value to your property from day one.",
  },
];

export default function AuthHeroPanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex col-span-6 xl:col-span-7 relative flex-col justify-between p-12 xl:p-16 text-white overflow-hidden select-none min-h-full">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg/auth-hero-bg.jpg"
          alt="Modern solar-powered residence"
          fill
          priority
          sizes="(max-width: 1200px) 50vw, 60vw"
          className="object-cover object-center filter brightness-[0.45] transition-all duration-700 hover:scale-105"
        />
        {/* Deep overlay gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-transparent to-zinc-950/20 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:32px_32px] opacity-30 z-10" />
      </div>

      {/* Top - Brand Header */}
      <div className="relative z-20 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:border-primary/50 group-hover:bg-white/25 transition-all duration-300">
            <Image src={LogoIcon} alt="logo" width={26} height={26} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors duration-300">
            Go<span className="text-primary">Solar</span>
          </span>
        </Link>
      </div>

      {/* Middle - Testimonial & Value Slider */}
      <div className="relative z-20 max-w-xl my-auto py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-5"
          >
            <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white tracking-tight drop-shadow-sm Outfit">
              {slides[currentSlide].title}
            </h1>
            <p className="text-zinc-200/90 text-sm xl:text-base leading-relaxed font-medium">
              {slides[currentSlide].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="flex items-center gap-2 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-6 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
