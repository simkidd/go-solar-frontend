"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, HeartHandshake, Zap, Cpu, Sun, BatteryCharging } from "lucide-react";

const VisionSection = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

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

  const getComponentInfo = () => {
    switch (activeComponent) {
      case "solar":
        return {
          title: "Solar Array",
          desc: "Tier-1 high-efficiency monocrystalline panels capturing maximum clean power.",
        };
      case "inverter":
        return {
          title: "Hybrid Inverter",
          desc: "Smart hybrid controller transfers load seamlessly in under 15 milliseconds.",
        };
      case "battery":
        return {
          title: "Battery Wall",
          desc: "Premium 5kWh LiFePO4 cells backed by our 5-Year Replacement Warranty.",
        };
      case "home":
        return {
          title: "Your Home",
          desc: "Quiet, uninterrupted power independence with zero diesel costs.",
        };
      default:
        return {
          title: "System Flow",
          desc: "Hover over components to trace clean solar energy flow.",
        };
    }
  };

  const info = getComponentInfo();

  return (
    <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/10 font-inter">
      <div className="container mx-auto px-4 space-y-16">
        {/* Centered Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 select-none">
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
            Energy Independence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            Why Choose Us for Your Energy Transformation Journey?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          {/* Left System Architecture Diagram */}
          <motion.div
            className="lg:col-span-6 relative rounded-[32px] overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md group flex items-center justify-center p-6 sm:p-8 min-h-[380px]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Visual background patterns */}
            <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Connection Lines & Flows */}
            {/* 1. Solar to Inverter */}
            <div className="absolute top-[64px] left-[64px] right-[64px] h-[2px] bg-zinc-800/80 z-0 overflow-hidden">
              <motion.div
                className="absolute top-0 h-full w-14 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                animate={{ left: ["-20%", "120%"] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
            </div>

            {/* 2. Inverter to Home */}
            <div className="absolute top-[64px] bottom-[136px] right-[64px] w-[2px] bg-zinc-800/80 z-0 overflow-hidden">
              <motion.div
                className="absolute left-0 w-full h-14 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
                animate={{ top: ["-20%", "120%"] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              />
            </div>

            {/* 3. Battery to Home */}
            <div className="absolute bottom-[136px] left-[64px] right-[64px] h-[2px] bg-zinc-800/80 z-0 overflow-hidden">
              <motion.div
                className="absolute top-0 h-full w-14 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                animate={{ left: ["120%", "-20%"] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
              />
            </div>

            {/* 4. Solar Array Node */}
            <div
              onMouseEnter={() => setActiveComponent("solar")}
              onMouseLeave={() => setActiveComponent(null)}
              className={`absolute top-6 left-6 sm:left-8 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 cursor-pointer z-10 ${
                activeComponent === "solar"
                  ? "bg-emerald-500/10 border-primary text-primary shadow-lg shadow-primary/10 scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <Sun className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-1 sm:mt-1.5 select-none">
                Solar Array
              </span>
            </div>

            {/* 5. Smart Inverter Node */}
            <div
              onMouseEnter={() => setActiveComponent("inverter")}
              onMouseLeave={() => setActiveComponent(null)}
              className={`absolute top-6 right-6 sm:right-8 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 cursor-pointer z-10 ${
                activeComponent === "inverter"
                  ? "bg-emerald-500/10 border-primary text-primary shadow-lg shadow-primary/10 scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <Cpu className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-1 sm:mt-1.5 select-none">
                Inverter
              </span>
            </div>

            {/* 6. Battery Wall Node */}
            <div
              onMouseEnter={() => setActiveComponent("battery")}
              onMouseLeave={() => setActiveComponent(null)}
              className={`absolute bottom-24 left-6 sm:left-8 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 cursor-pointer z-10 ${
                activeComponent === "battery"
                  ? "bg-emerald-500/10 border-primary text-primary shadow-lg shadow-primary/10 scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <BatteryCharging className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-1 sm:mt-1.5 select-none">
                Battery Wall
              </span>
            </div>

            {/* 7. Smart Home Node */}
            <div
              onMouseEnter={() => setActiveComponent("home")}
              onMouseLeave={() => setActiveComponent(null)}
              className={`absolute bottom-24 right-6 sm:right-8 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 cursor-pointer z-10 ${
                activeComponent === "home"
                  ? "bg-emerald-500/10 border-primary text-primary shadow-lg shadow-primary/10 scale-105"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <Zap className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-1 sm:mt-1.5 select-none">
                Your Home
              </span>
            </div>

            {/* Description Text Bar */}
            <div className="absolute bottom-4 left-4 right-4 h-14 bg-white/5 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-850 rounded-2xl px-4 py-2 flex items-center gap-3 z-10 select-none">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 text-left flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase text-primary tracking-wider truncate">
                  {info.title}
                </p>
                <p className="text-[11px] text-zinc-300 font-semibold truncate">
                  {info.desc}
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
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
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
