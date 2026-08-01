// components/home/AboutSection.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sun, Leaf, Shield, Award } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Sun,
      title: "Clean Energy",
      desc: "Harness unlimited, pure power from the sun to eliminate your carbon footprint.",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
    },
    {
      icon: Leaf,
      title: "Sustainable Sizing",
      desc: "Eco-friendly, precise configurations designed to preserve battery lifespans.",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      icon: Shield,
      title: "Reliable Support",
      desc: "Every installation is backed by comprehensive multi-year hardware warranties.",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Award,
      title: "Certified Experts",
      desc: "Licensed technicians managing safe structural mounting and electrical wiring.",
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20",
    },
  ];

  return (
    <section className="w-full relative py-28 bg-white dark:bg-zinc-950 overflow-hidden font-inter border-y border-zinc-100 dark:border-zinc-900">
      {/* Decorative text stroke background */}
      <div className="absolute top-10 left-10 pointer-events-none select-none z-0">
        <span className="text-[120px] font-extrabold text-transparent text-stroke leading-none tracking-tight opacity-40 uppercase">
          Solar
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Text Column */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
              About GoSolar
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight tracking-tight">
              We Are Specialists in Sustainable Energy Sizing
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
              GoSolar specializes in designing premium, customized solar energy
              systems for residential homes, corporate workspaces, and
              industrial settings. By combining clean tier-1 hardware components
              with advanced sizing analytics, we secure stable power grids that
              last.
            </p>

            <div className="flex gap-6 items-center pt-4">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-[#08AA08]">99.8%</p>
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mt-1">
                  Uptime Sized
                </p>
              </div>
              <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="text-center">
                <p className="text-3xl font-extrabold text-[#08AA08]">500+</p>
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mt-1">
                  Properties Sized
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Features Column */}
          <motion.div
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 p-6 rounded-2xl space-y-4 hover:shadow-sm hover:border-[#08AA08]/30 transition-all duration-300"
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${feat.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
