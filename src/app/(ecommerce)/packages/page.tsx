import Cta from "@/app/(ecommerce)/components/shop/Cta";
import { Metadata } from "next";
import { PACKAGES_DATA } from "@/data/packages";
import { formatCurrency } from "@/utils/helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Complete Solar Packages | GoSolar",
  description:
    "Explore pre-sized complete hybrid solar package installations for homes and offices by GoSolar.",
};

const PackagesPage = () => {
  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 min-h-screen">
      <section className="w-full">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6">
            <Cta />
          </div>

          <div className="text-center max-w-2xl mx-auto space-y-3 mt-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
              Package Offers
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Pre-Configured Solar Packages
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Explore our range of professional hybrid solar packages tailored
              for houses, apartments, and commercial facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10 pb-16">
            {PACKAGES_DATA.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md hover:border-[#08AA08]/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-850 flex flex-col items-center justify-center text-zinc-400">
                    <div className="absolute inset-0 bg-linear-to-br from-[#064e3b] to-emerald-700 opacity-5" />
                    <svg
                      className="w-12 h-12 text-[#08AA08]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500 mt-2">
                      GoSolar Setup
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${pkg.badgeColor}`}
                    >
                      {pkg.inverterRange} Range
                    </span>
                    <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed min-h-[36px]">
                      {pkg.desc}
                    </p>
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
                        Configuration
                      </span>
                      <p className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 leading-normal">
                        {pkg.spec}
                      </p>
                    </div>
                  </div>
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
