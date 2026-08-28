"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FinancingApplyModal from "@/components/custom/FinancingApplyModal";

const cards = [
  {
    title: "Individual Financing",
    desc: "Spread the cost of your home solar installation across flexible monthly repayments. Start with a low down payment and own your system outright.",
    requirement: "NIN + Passport Required",
  },
  {
    title: "Corporate Financing",
    desc: "Purpose-built energy financing for registered companies, factories, and institutions. Optimise operating costs and eliminate generator dependency.",
    requirement: "CAC + Passport Required",
  },
];

export default function FinancingSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/10 font-inter">
      <div className="container mx-auto px-4 space-y-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-3 select-none">
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
            Flexible Payments
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            Solar Financing Options
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
            Break free from grid tariffs and generator noise. Own clean, reliable
            solar power now and pay at your pace — for both homes and businesses.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-[24px] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#08AA08]/20 transition-colors duration-300 font-semibold"
            >
              <div className="space-y-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed min-h-[48px]">
                  {card.desc}
                </p>
              </div>

              <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary/70">
                  {card.requirement}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider h-11 px-8 rounded-full flex items-center gap-1.5"
          >
            Apply for Financing
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Modal — controlled locally, no URL params */}
      <FinancingApplyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
