"use client";

import LeaderboardBanner from "@/app/(ecommerce)/components/shop/LeaderboardBanner";
import { formatCurrency } from "@/utils/helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePackagesQuery } from "@/hooks/queries/usePackagesQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { SolarPackage } from "@/interfaces/package.interface";

const PackagesPageClient = () => {
  const { data: packages, isLoading, error, refetch } = usePackagesQuery();

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

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-24 px-4 font-inter bg-white dark:bg-zinc-950 min-h-[60vh]">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500 stroke-[1.5]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-955 dark:text-zinc-50">
              Failed to load solar packages
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Please check your connection and try again.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-xs rounded-xl"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Retry
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs rounded-xl text-zinc-500 hover:text-zinc-955 dark:hover:text-zinc-50"
            >
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 min-h-screen">
      <section className="w-full">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6">
            <LeaderboardBanner />
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-3 mt-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
              Package Offers
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Pre-Configured Solar Packages
            </h2>
            <p className="text-zinc-505 dark:text-zinc-400 text-sm leading-relaxed font-semibold">
              Explore our range of professional hybrid solar packages tailored
              for houses, apartments, and commercial facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10 pb-16">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-6 border rounded-3xl space-y-4">
                  <Skeleton className="h-40 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-1/2 rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))
            ) : packages.length === 0 ? (
              <div className="col-span-full text-center py-12 text-zinc-550 font-semibold">
                No solar packages available at this time.
              </div>
            ) : (
              packages.map((pkg: any) => {
                const badgeColor = getBadgeColor(pkg.capacityKva);
                return (
                  <div
                    key={pkg._id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md hover:border-[#08AA08]/40 transition-all duration-300 font-semibold"
                  >
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}
                      >
                        {pkg.capacityKva} kVA Range
                      </span>
                      <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white leading-tight">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed min-h-[36px]">
                        {pkg.description}
                      </p>
                      {pkg.tagline && (
                        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 space-y-1">
                          <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
                            Configuration
                          </span>
                          <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 leading-normal">
                            {pkg.tagline}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          Starting Price
                        </span>
                        <p className="text-xl font-extrabold text-[#08AA08]">
                          {formatCurrency(pkg.price, "NGN")}
                        </p>
                      </div>
                      <Link href={`/packages/${pkg.slug}`}>
                        <Button className="bg-[#08AA08] hover:bg-[#079907] text-white text-xs font-bold rounded-xl px-5 py-2">
                          Configure →
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPageClient;
