"use client";
import React from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, Shield, HeartHandshake, Zap, Cpu } from "lucide-react";

const VisionSection = () => {
  const points = [
    {
      icon: Cpu,
      title: "Customized Sizing Sizing",
      desc: "Precision sizing algorithms ensuring your battery banks and solar panels are sized perfectly to run your loads without failure.",
    },
    {
      icon: Zap,
      title: "24/7 Power Security",
      desc: "Automatic hybrid changeover kits transferring power instantly between grid, backup, and solar.",
    },
    {
      icon: Shield,
      title: "Premium Tier-1 Equipment",
      desc: "Only high-grade monocrystalline panels, smart hybrid inverters, and long-life Lithium batteries.",
    },
    {
      icon: HeartHandshake,
      title: "5-Year Warranty Support",
      desc: "Complete replacement warranty protection on battery storage walls and expert onsite post-install support.",
    },
  ];

  return (
    <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/10 font-inter">
      <div className="container mx-auto px-4 space-y-16">
        {/* Centered Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
            Energy Independence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Why Choose Us for Your Energy Transformation Journey?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Player Video Mockup */}
          <motion.div
            className="lg:col-span-6 relative aspect-video sm:aspect-square lg:aspect-[4/3] rounded-[32px] overflow-hidden bg-emerald-950 border border-zinc-200 dark:border-zinc-800 shadow-md group flex items-center justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Visual background pattern */}
            <div className="absolute inset-0 z-0 bg-linear-to-tr from-emerald-900 via-zinc-950 to-zinc-900 opacity-80" />
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#08AA08_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Center Play Button Mockup */}
            <div className="relative z-10 h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Play className="h-6 w-6 fill-white ml-0.5" />
            </div>

            {/* Float visual widget */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 z-10">
              <div className="h-8 w-8 rounded-lg bg-[#08AA08] flex items-center justify-center text-white shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 text-left">
                <p className="text-[10px] font-extrabold uppercase text-white tracking-wider">
                  Premium Installers
                </p>
                <p className="text-xs text-zinc-200 font-bold">
                  Watch our custom sizing workflow
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Bubble Points */}
          <div className="lg:col-span-6 space-y-6">
            {points.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <motion.div
                  key={pt.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl shadow-xs"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#08AA08]/10 text-[#08AA08] flex items-center justify-center shrink-0 border border-[#08AA08]/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">
                      {pt.title}
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                      {pt.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
