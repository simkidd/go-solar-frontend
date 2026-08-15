"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    n: "01",
    title: "Assess",
    desc: "We conduct a detailed site survey and load analysis to understand your exact energy requirements.",
  },
  {
    n: "02",
    title: "Design",
    desc: "Our engineers design a custom system optimised for your location, load profile, and budget.",
  },
  {
    n: "03",
    title: "Install",
    desc: "Our certified installation team completes the work professionally, typically within 2–5 days.",
  },
  {
    n: "04",
    title: "Monitor",
    desc: "We commission your system and provide ongoing monitoring through our customer portal.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28 bg-background font-inter">
      <div className="container mx-auto px-4">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-14">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
              The Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              How GoSolar Works
            </h2>
          </div>
          <Link href="/energy-calculator" className="shrink-0">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider h-11 px-8 rounded-full">
              Get Sized
            </Button>
          </Link>
        </div>

        {/* 1px Gap Border Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-xs">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card text-card-foreground p-8 flex flex-col justify-start h-72 hover:bg-secondary/40 transition-colors"
            >
              {/* Step Number */}
              <div className="font-heading font-black text-6xl text-zinc-200 dark:text-zinc-800 mb-4 leading-none select-none">
                {step.n}
              </div>
              
              {/* Step Title */}
              <div className="font-heading font-extrabold text-xl text-foreground mb-3">
                {step.title}
              </div>
              
              {/* Step Desc */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
