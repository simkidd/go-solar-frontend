"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] bg-zinc-950 text-white font-inter flex flex-col justify-center items-center overflow-hidden border-b border-zinc-900 ">
      {/* ── Looping Background Video & Fallback Poster ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/beautiful-alternative-energy-plant-with-solar-panels.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none  opacity-45"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-solar-panels-on-a-roof-40348-large.mp4"
          type="video/mp4"
        />
      </video>

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
          Power Your{" "}
          <span className="bg-linear-to-r from-emerald-400 to-primary bg-clip-text text-transparent drop-shadow-sm">
            Future
          </span>
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

        {/* Stats inline row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-10 border-t border-white/10 grid grid-cols-3 gap-8 sm:gap-16 max-w-lg w-full"
        >
          {[
            {
              value: "500+",
              label: "Installations",
              tooltip: "Active residential & enterprise sites across Nigeria.",
            },
            {
              value: "5 MW",
              label: "Capacity",
              tooltip: "Total clean solar generation capacity deployed.",
            },
            {
              value: "15 Yrs",
              label: "Experience",
              tooltip:
                "Pioneering engineering experience in sustainable power.",
            },
          ].map((stat, idx) => (
            <div key={idx} className="group relative cursor-default">
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-white group-hover:text-emerald-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                {stat.label}
              </div>
              {/* Floating Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 scale-0 group-hover:scale-100 transition-all origin-bottom duration-200 bg-zinc-900 border border-zinc-800 rounded-lg p-2 shadow-xl text-[9px] text-zinc-400 z-50 pointer-events-none">
                {stat.tooltip}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
