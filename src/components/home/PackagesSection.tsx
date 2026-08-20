"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/utils/helpers";
import { usePackagesQuery } from "@/hooks/queries/usePackagesQuery";
import { Skeleton } from "@/components/ui/skeleton";

const PackagesSection = () => {
  const { data: packages = [], isLoading } = usePackagesQuery();

  // Select a subset of up to 4 setups for the homepage display
  const homePackages = useMemo(() => {
    return [...packages].slice(0, 4);
  }, [packages]);

  const getBadgeColor = (kva: number) => {
    if (kva <= 2) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50";
    }
    if (kva <= 3.5) {
      return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/50";
    }
    if (kva <= 5) {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
    }
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50";
  };

  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-24 bg-white dark:bg-zinc-950 font-inter">
      <div className="container mx-auto px-4 space-y-16">
        {/* Header Title */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-3 select-none">
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
            Pre-Configured Setups
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            Explore Our Solar Packages
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
            Standard pre-designed configurations sized to support common
            residential and commercial loads with long-term hardware durability.
          </p>
        </div>

        {/* Packages Cards list */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-8 border rounded-[24px] space-y-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : homePackages.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 font-semibold py-8">
            No packages currently available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {homePackages.map((pkg: any, index) => {
              if (!pkg) return null;
              const badgeColor = getBadgeColor(pkg.capacityKva);
              return (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-[24px] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-lg hover:border-[#08AA08]/20 transition-all duration-300 relative overflow-hidden group font-semibold"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase border ${badgeColor}`}
                      >
                        {pkg.capacityKva} kVA
                      </span>
                      <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                        GoSolar configuration
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-[#08AA08] transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed min-h-[36px]">
                      {pkg.description}
                    </p>

                    {/* Specs list */}
                    {pkg.tagline && (
                      <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                          System Specifications
                        </span>
                        <ul className="grid grid-cols-1 gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {pkg.tagline
                            .split(" + ")
                            .map((spec: string, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span>{spec}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-850">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">
                        Installed Price
                      </span>
                      <p className="text-xl sm:text-2xl font-extrabold text-[#08AA08]">
                        {formatCurrency(pkg.price, "NGN")}
                      </p>
                    </div>
                    <Link href={`/packages/${pkg.slug}`}>
                      <Button className="bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-xl px-5 gap-1.5 h-10 text-xs font-bold uppercase tracking-wider">
                        Configure Setup
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Link href="/packages">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider h-11 px-8 rounded-full">
              View All Packages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
