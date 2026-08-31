"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  Building2,
  Zap,
  Battery,
  Wrench,
  BarChart3,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { SOLUTIONS } from "@/data/solutions";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<any>> = {
  Home,
  Building2,
  Zap,
  Battery,
  Wrench,
  BarChart3,
  ShieldCheck,
  Cpu,
};

const SolutionsSection = () => {
  const featuredSolutions = SOLUTIONS.filter((s) => s.featured).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-background font-inter">
      <div className="container mx-auto px-4">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 ">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Complete Solar Solutions
            </h2>
          </div>

          <Link href="/solutions" className="">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 rounded-full font-bold text-xs uppercase tracking-wider h-11">
              View all solutions
            </Button>
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
              <Link
                href={`/solutions/${sol.slug}`}
                className="flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="text-primary ">
                    {(() => {
                      const IconComponent = iconMap[sol.icon] || Zap;
                      return <IconComponent className="h-9 w-9 stroke-[1.5]" />;
                    })()}
                  </div>

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
