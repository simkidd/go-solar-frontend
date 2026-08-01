"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SLIDES = [
  {
    tag: "Solar Financing",
    title: "Go Solar Now,\nPay Later",
    desc: "Enjoy clean, reliable energy without breaking the bank. Our flexible financing options let you install your system today and pay over time.",
    actionText: "Apply for Financing",
    actionLink: "/contact-us?subject=Financing",
    tagClass:
      "bg-sky-100 dark:bg-sky-950/45 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-850",
    image: "/images/bg/hero-bg.jpg",
  },
  {
    tag: "Certified Installations",
    title: "Powering Nigeria\nWith Reliable Solar",
    desc: "Experience zero blackouts and complete energy independence. We design and install high-efficiency solar setups for homes and enterprises.",
    actionText: "Request Free Quote",
    actionLink: "/contact-us?subject=Quote",
    tagClass:
      "bg-emerald-100 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-850",
    image: "/images/bg/contact-bg.jpg",
  },
  {
    tag: "Smart Power Audit",
    title: "Save Up To 75%\nOn Monthly Bills",
    desc: "Stop wasting money on grid tariffs and diesel generators. Run our calculator tool to find the exact setup your home or workspace needs.",
    actionText: "Start Energy Calculator",
    actionLink: "/energy-calculator",
    tagClass:
      "bg-amber-100 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-850",
    image: "/images/bg/about-us.jpg",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const MotionImage = motion.create(Image);

  return (
    <section className="w-full relative bg-zinc-950 font-inter min-h-[560px] md:min-h-[640px] flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background image fade transitions */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <AnimatePresence mode="wait">
          <MotionImage
            key={currentSlide}
            src={SLIDES[currentSlide].image}
            alt=""
            fill
            priority={currentSlide === 0}
            sizes="100vw"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="object-cover object-center"
          />
        </AnimatePresence>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 z-10 bg-linear-to-b from-black/55 via-black/50 to-black/65" />
      </div>

      {/* Centered Content Block */}
      <div className="relative z-20 max-w-3xl px-6 md:px-12 py-20 space-y-6 flex flex-col items-center">
        {/* Slide Tag Badge */}
        <AnimatePresence mode="wait">
          <motion.span
            key={currentSlide + "-tag"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs transition-colors duration-300 ${SLIDES[currentSlide].tagClass}`}
          >
            {SLIDES[currentSlide].tag}
          </motion.span>
        </AnimatePresence>

        {/* Slogan Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentSlide + "-title"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white tracking-tight whitespace-pre-line"
          >
            {SLIDES[currentSlide].title}
          </motion.h1>
        </AnimatePresence>

        {/* Slogan Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentSlide + "-desc"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed"
          >
            {SLIDES[currentSlide].desc}
          </motion.p>
        </AnimatePresence>

        {/* CTA Button */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSlide}-cta`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-2"
          >
            <Link href={SLIDES[currentSlide].actionLink}>
              <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-full flex items-center gap-2 shadow-md hover:scale-105 transition-all duration-300">
                {SLIDES[currentSlide].actionText}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2.5 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-6 bg-[#08AA08]"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
