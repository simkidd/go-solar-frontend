"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CtaButton {
  label: string;
  href: string;
  variant?: "primary" | "outline";
}

interface PageHeaderProps {
  badge?: string;
  heading: string;
  subtitle?: string;
  image?: string;
  cta?: CtaButton[];
  className?: string;
  minHeight?: string;
  align?: "center" | "left";
}

const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  heading,
  subtitle,
  image,
  cta,
  className,
  minHeight = "min-h-[480px] md:min-h-[540px]",
  align = "center",
}) => {
  const isLeft = align === "left";

  return (
    <section
      className={cn(
        "w-full relative bg-zinc-950 flex flex-col justify-center overflow-hidden font-inter",
        isLeft ? "items-start text-left" : "items-center text-center",
        minHeight,
        className,
      )}
    >
      {/* Background Image */}
      {image && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-35 select-none pointer-events-none"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* Green gradient overlay */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-[#064e3b]/80 via-[#064e3b]/70 to-black/90" />

      {/* Content */}
      <div
        className={cn(
          "relative z-20 container mx-auto px-6 md:px-12 py-16 space-y-6 flex flex-col",
          isLeft ? "items-start text-left" : "items-center text-center",
        )}
      >
        {badge && (
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block select-none">
            {badge}
          </span>
        )}

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white tracking-tight select-none">
          {heading}
        </h1>

        {subtitle && (
          <p className="text-zinc-300 text-sm sm:text-base max-w-xl leading-relaxed font-semibold">
            {subtitle}
          </p>
        )}

        {cta && cta.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap gap-3 pt-2",
              isLeft ? "justify-start" : "justify-center",
            )}
          >
            {cta.map((btn) => (
              <Link key={btn.href} href={btn.href}>
                {btn.variant === "outline" ? (
                  <button className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-white/40 text-white hover:bg-white/10 transition-all cursor-pointer">
                    {btn.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-md hover:scale-105 transition-all cursor-pointer">
                    {btn.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
