"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const HomeContactCta = () => {
  return (
    <section className="bg-zinc-900 dark:bg-zinc-950/60 py-20 lg:py-28 relative overflow-hidden font-inter border-t border-border">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
          Get Started Today
        </span>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Ready to Go Solar?
        </h2>
        
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-semibold">
          Join over 500 homes and businesses that trust GoSolar for professional, reliable solar energy solutions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/energy-calculator">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest h-12 px-8 rounded-full flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all duration-300">
              Calculate Your System
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact-us">
            <Button className="w-full sm:w-auto border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-widest h-12 px-8 rounded-full transition-all">
              Contact Our Team
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeContactCta;
