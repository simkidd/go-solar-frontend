"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FAQS = [
  {
    question: "How do you size solar systems?",
    answer:
      "We analyze your monthly utility bills, run load tests on active appliances (AC, pump, fridge), and check structural roof conditions to size optimal panel and battery configs.",
  },
  {
    question: "What is the lifetime of battery banks?",
    answer:
      "Tier-1 Lithium battery walls last between 10-15 years (approx. 6000 cycles at 80% DOD), whereas AGM battery banks usually need replacement within 3-5 years depending on thermal exposure.",
  },
  {
    question: "How does the hybrid changeover work?",
    answer:
      "Our smart hybrid systems automatically transition loads to battery/solar during outages within 10 milliseconds, preventing computers or refrigerators from resetting.",
  },
  {
    question: "Do you offer post-installation maintenance?",
    answer:
      "Yes, every package includes 1 year of free quarterly checkups, connection security checks, panel cleaning tutorials, and remote system telemetry updates.",
  },
];

const FaqNewsletterSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full py-24 bg-white dark:bg-zinc-950 font-inter border-b border-zinc-150 dark:border-zinc-850">
      <div className="container mx-auto px-4 space-y-20">
        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQ Left Block */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
              FAQ Support
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Find answers to design questions, sizing configurations, safety
              changeovers, and warranties.
            </p>
            <div className="pt-2">
              <Link href="/contact-us">
                <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl px-6 h-10">
                  Ask Anything
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Accordion Right Block */}
          <div className="lg:col-span-7 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="border border-zinc-150 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-bold text-xs sm:text-sm text-zinc-850 dark:text-zinc-200 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-zinc-450 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="px-5 pb-5 text-xs text-zinc-505 dark:text-zinc-400 leading-relaxed font-semibold">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter Banner Block */}
        <div className="relative rounded-[32px] bg-zinc-900 overflow-hidden min-h-[260px] flex items-center p-8 sm:p-12 border dark:border-zinc-800 shadow-md">
          {/* Overlay Background */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25"
            style={{ backgroundImage: `url('/images/bg/about-us.jpg')` }}
          />
          <div className="absolute inset-0 z-0 bg-linear-to-r from-zinc-950 via-zinc-950/80 to-transparent" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                Stay Updated with Solar Insights
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Subscribe to our newsletter to receive sizing checklists, grid
                savings audits, and product alerts.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full bg-zinc-950/60 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-[#08AA08] transition-colors"
                />
              </div>
              <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-5 shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqNewsletterSection;
