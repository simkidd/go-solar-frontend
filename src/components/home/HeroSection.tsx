"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "../../../public/images/beautiful-alternative-energy-plant-with-solar-panels.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] bg-zinc-950 text-white font-inter flex flex-col justify-center items-center overflow-hidden border-b border-zinc-900 ">
      {/* ── Optimized Hero Background Image with Blur Placeholder ── */}
      <Image
        src={heroBg}
        alt="Solar Panels Background"
        fill
        priority
        quality={85}
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-center z-0 pointer-events-none opacity-40"
      />

      {/* Dark Overlay mask for maximum typography readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10 pointer-events-none" />

      {/* ── Centered Hero Content ── */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center space-y-8">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-tight"
        >
          Power Your Future
          <br />
          with Solar Energy
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed max-w-2xl font-medium"
        >
          Professional solar design, supply, and installation for homes and
          businesses across Nigeria. Cut your monthly energy bills by up to 90%
          using clean power.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4 w-full sm:w-auto"
        >
          <Link href="/energy-calculator" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest h-12 px-8 rounded-full flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all duration-300">
              Calculate Your System
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/#financing" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest h-12 px-8 rounded-full transition-all">
              Explore Financing
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
