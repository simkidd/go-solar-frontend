"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SOLUTIONS } from "@/data/solutions";

const SolutionsSection = () => {
  const featuredSolutions = SOLUTIONS.filter((s) => s.featured).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-background font-inter">
      <div className="container mx-auto px-4">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Complete Solar Solutions
            </h2>
          </div>
          <Link
            href="/solutions"
            className="text-xs sm:text-sm font-extrabold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            View all solutions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 1px Gap Border Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden shadow-xs border border-border">
          {featuredSolutions.map((sol, index) => (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card text-card-foreground p-8 hover:bg-secondary/40 transition-colors group flex flex-col justify-between h-80 cursor-pointer"
            >
              <Link href={`/solutions/${sol.slug}`} className="flex flex-col justify-between h-full">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="text-4xl select-none">{sol.icon}</div>
                  
                  {/* Title */}
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors leading-tight">
                    {sol.title}
                  </h3>
                  
                  {/* Subtitle / Excerpt */}
                  <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    {sol.subtitle}
                  </p>
                </div>

                {/* Call-to-action arrow */}
                <div className="pt-4">
                  <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-primary group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
                    Learn more →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
