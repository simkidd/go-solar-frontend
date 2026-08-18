"use client";
import React from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, Sun, Shield } from "lucide-react";

const CounterSection = () => {
  const partners = [
    { name: "Growatt", category: "Inverter Specialist" },
    { name: "Jinko Solar", category: "Solar Panels" },
    { name: "Hithium", category: "Lithium Cells" },
    { name: "SMA", category: "Grid Inverters" },
    { name: "Victron Energy", category: "Smart Sizing" },
    { name: "Luxpower", category: "Hybrid Power" },
  ];

  return (
    <section className="w-full py-24 bg-white dark:bg-zinc-950 font-inter relative overflow-hidden">
      
      {/* Centering Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">Industrial Partners</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Trusted Tier-1 Equipment Partners
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            We source all components directly from manufacturers with factory warranties.
          </p>
        </div>

        {/* Floating Cluster Layout */}
        <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto">
          {partners.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 px-6 py-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px] text-center shadow-xs"
            >
              <span className="font-extrabold text-sm sm:text-base text-zinc-800 dark:text-zinc-100">{p.name}</span>
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">{p.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;