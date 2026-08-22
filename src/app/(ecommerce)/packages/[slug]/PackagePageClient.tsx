"use client";

import React from "react";
import { formatCurrency } from "@/utils/helpers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AddToCartBtn from "./components/AddToCartBtn";
import ProductImages from "@/app/(ecommerce)/components/shop/ProductImages";
import { usePackageByIdQuery } from "@/hooks/queries/usePackagesQuery";
import { SolarPackage } from "@/interfaces/package.interface";

interface PackagePageClientProps {
  package: SolarPackage;
}

const PackagePageClient: React.FC<PackagePageClientProps> = ({
  package: pkg,
}) => {
  if (!pkg) {
    notFound();
  }

  // Sizing Load Capabilities (use powers array from DB, or fall back to capacity rules)
  const loadCapabilities =
    pkg.powers && pkg.powers.length > 0
      ? pkg.powers
      : pkg.capacityKva >= 10
        ? [
            "2 Inverter Air Conditioners (1.5 HP)",
            "1 Pump Machine / Water Dispenser",
            "2 Refrigerators or Deep Freezers",
            "10-15 Smart Fans",
            "20 LED Bulbs & lighting points",
            "Charging ports for laptops, phones, & work accessories",
          ]
        : pkg.capacityKva >= 7.5
          ? [
              "1 Inverter Air Conditioner (1.5 HP)",
              "1 Refrigerator / Deep Freezer",
              "8-10 Smart Fans",
              "15 LED Bulbs",
              "2 LED Televisions",
              "Laptops & mobile devices",
            ]
          : pkg.capacityKva >= 5
            ? [
                "1 Refrigerator or Deep Freezer",
                "6-8 Smart Fans",
                "10-12 LED Bulbs",
                "2 LED Televisions",
                "Laptops & mobile devices",
              ]
            : pkg.capacityKva >= 3.5
              ? [
                  "1 Refrigerator (Medium)",
                  "4-6 Smart Fans",
                  "8-10 LED Bulbs",
                  "1 LED Television",
                  "Charging phones & laptops",
                ]
              : [
                  "3-5 Smart Fans",
                  "6-8 LED Bulbs",
                  "1 LED Television",
                  "Mobile phones & basic gadgets",
                ];

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

  const badgeColor = getBadgeColor(pkg.capacityKva);

  // Extract images from populated constituent products
  const packageImages =
    pkg.constituents && pkg.constituents.length > 0
      ? pkg.constituents.reduce((acc: any[], c: any) => {
          const imgUrl = c.product?.images?.[0]?.url;
          if (imgUrl) {
            acc.push({
              url: imgUrl,
              public_id: c.product._id,
            });
          }
          return acc;
        }, [])
      : [];

  // Fallback if constituents have no images
  const finalImages =
    packageImages.length > 0
      ? packageImages
      : [{ url: "/images/bg/hero-bg.jpg", public_id: "hero" }];

  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 pb-16">
      {/* Breadcrumbs Navigation */}
      <div className="w-full bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-150 dark:border-zinc-855 py-3.5">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-505">
            <Link
              href="/shop"
              className="hover:text-zinc-955 dark:hover:text-white transition-colors"
            >
              Store
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700 select-none">
              /
            </span>
            <Link
              href="/packages"
              className="hover:text-zinc-955 dark:hover:text-white transition-colors"
            >
              Packages
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700 select-none">
              /
            </span>
            <span className="text-zinc-900 dark:text-white font-bold select-none truncate max-w-[280px]">
              {pkg.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main package display grid */}
      <section className="w-full py-12 bg-white dark:bg-zinc-955">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Graphics & What it powers */}
            <div className="lg:col-span-7 space-y-8">
              {/* Graphic wrapper */}
              <div className="w-full">
                <ProductImages images={finalImages} />
              </div>

              {/* What it powers card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-4">
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                  What It Powers (Simultaneous Usable Loads)
                </h3>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-semibold">
                  Below is the recommended loading design to operate comfortably
                  with this configuration:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {loadCapabilities.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-zinc-650 dark:text-zinc-350"
                    >
                      <div className="h-5 w-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="font-semibold leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sizing configuration & purchase details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                {/* Titles */}
                <div className="space-y-2 pb-4 border-b border-zinc-100 dark:border-zinc-800 font-semibold">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}
                  >
                    {pkg.capacityKva} kVA Solar Setup
                  </span>
                  <h1 className="font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-white tracking-tight leading-tight">
                    {pkg.name}
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                    {pkg.description}
                  </p>
                </div>

                {/* Technical specs bullet list */}
                <div className="space-y-3 font-semibold">
                  <h4 className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">
                    Included Hardware & Services
                  </h4>
                  <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 space-y-3">
                    {pkg.tagline ? (
                      pkg.tagline
                        .split(" + ")
                        .map((spec: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                          >
                            <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{pkg.capacityKva}kVA Inverter System Setup</span>
                      </div>
                    )}
                    {pkg.highlights &&
                      pkg.highlights.map((highlight: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                        >
                          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 pt-2 border-t dark:border-zinc-800">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Complete Free Certified Installation</span>
                    </div>
                  </div>
                </div>

                {/* Price block */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                    Installed System Cost
                  </span>
                  <p className="text-3xl font-extrabold text-[#08AA08]">
                    {formatCurrency(pkg.price, "NGN")}
                  </p>
                </div>

                {/* Action button handlers client-side */}
                <AddToCartBtn pkg={pkg} />

                {/* Good to know block */}
                <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 font-semibold">
                  <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                    Good to know
                  </h4>
                  <h5 className="text-[11px] font-bold text-zinc-900 dark:text-white">
                    Onsite Setup &amp; Cabling Included
                  </h5>
                  <p className="text-[10px] text-zinc-505 dark:text-zinc-450 leading-relaxed font-semibold">
                    This solar configuration is optimized for complete
                    installation. Our certified engineers will carry out onsite
                    assessments, changeover configuration, surge wiring, and
                    test runs completely free.
                  </p>
                </div>
              </div>

              {/* Delivery specifications card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-4 font-semibold">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  Delivery &amp; Setup Info
                </h4>
                <div className="space-y-3.5">
                  <div className="flex gap-3 items-start">
                    <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <h5 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                        Nigeria Delivery Coverage
                      </h5>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                        Free delivery and onsite technicians dispatch within
                        Lagos, Port Harcourt, and Uyo experience center ranges
                        (4-5 working days standard).
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <RefreshCcw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <h5 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                        Warranty Protection
                      </h5>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                        Complete support coverage including 25 years warranty on
                        solar panels and 2-5 years replacement policies on
                        lithium batteries.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagePageClient;
