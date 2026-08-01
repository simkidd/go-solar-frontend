"use client";
import React from "react";
import { motion } from "framer-motion";
import { Calculator, FileText, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: Calculator,
    stepNum: "Step 01",
    title: "Run Sizing Calculator",
    desc: "Use our interactive solar calculator to size your load accurately.",
    bgGradient: "from-amber-500/10 to-transparent",
    iconColor: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: FileText,
    stepNum: "Step 02",
    title: "Get Consultation",
    desc: "Connect with our Port Harcourt experts for details.",
    bgGradient: "from-sky-500/10 to-transparent",
    iconColor: "text-sky-500 bg-sky-500/10",
  },
  {
    icon: Wrench,
    stepNum: "Step 03",
    title: "Install Custom Setup",
    desc: "Our engineers mount panels, changeovers, and batteries securely.",
    bgGradient: "from-emerald-500/10 to-transparent",
    iconColor: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: Zap,
    stepNum: "Step 04",
    title: "Power Up System",
    desc: "Switch to clean green solar energy and run grid/battery seamlessly.",
    bgGradient: "from-[#08AA08]/10 to-transparent",
    iconColor: "text-[#08AA08] bg-[#08AA08]/10",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-24 bg-white dark:bg-zinc-950 font-inter border-b border-zinc-150 dark:border-zinc-850">
      <div className="container mx-auto px-4 space-y-16">
        {/* Header Grid */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
              Step-By-Step Installation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
              Transitioning to sustainable solar power is simple and direct. Run
              through our calculator, request a quote, and let our technicians
              handle the rest.
            </p>
          </div>
          <Link href="/energy-calculator" className="shrink-0">
            <Button
              variant="outline"
              className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 h-10 px-5"
            >
              Get Sized
            </Button>
          </Link>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between h-72 hover:border-[#08AA08]/20 transition-all duration-300 overflow-hidden"
              >
                {/* Accent Background Gradient */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${step.bgGradient} opacity-50 z-0 pointer-events-none`}
                />

                {/* Top content */}
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${step.iconColor}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      {step.stepNum}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                    {step.title}
                  </h4>
                </div>

                {/* Bottom desc */}
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold relative z-10">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
