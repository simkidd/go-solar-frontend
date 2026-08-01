"use client";
import React from "react";
import { motion } from "framer-motion";
import Review from "@/components/Review";

const TestimonialSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full py-24 bg-white dark:bg-zinc-950 font-inter border-b border-zinc-150 dark:border-zinc-850"
    >
      <div className="container mx-auto px-4 space-y-16">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
            Customer Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
            Real feedback from homeowners and enterprise clients relying on our
            power systems.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="py-2">
          <Review />
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialSection;
