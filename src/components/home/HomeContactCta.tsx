"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HomeContactCtaProps {
  tagline?: string;
  title?: string;
  subtitle?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
  bgImage?: string;
}

const HomeContactCta: React.FC<HomeContactCtaProps> = ({
  tagline = "Get Started Today",
  title = "Ready to Go Solar?",
  subtitle = "Join over 500 homes and businesses that trust GoSolar for professional, reliable solar energy solutions.",
  primaryText = "Calculate Your System",
  primaryLink = "/energy-calculator",
  secondaryText = "Contact Our Team",
  secondaryLink = "/contact-us",
  bgImage = "/images/bg/contact-bg.jpg",
}) => {
  return (
    <section className="bg-zinc-900 dark:bg-zinc-950/60 py-20 lg:py-28 relative overflow-hidden font-inter border-t border-border">
      {/* Background Image overlay */}
      {bgImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-15  pointer-events-none"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      )}

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block ">
          {tagline}
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight ">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-zinc-300 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-semibold">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href={primaryLink}>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest h-12 px-8 rounded-full flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
              {primaryText}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={secondaryLink}>
            <Button className="w-full sm:w-auto border border-zinc-705 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-widest h-12 px-8 rounded-full transition-all cursor-pointer">
              {secondaryText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeContactCta;
