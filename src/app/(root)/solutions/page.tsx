import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { SOLUTIONS } from "@/data/solutions";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Solutions",
  description:
    "From simple residential backup to large commercial installations, GoSolar provides end-to-end solar energy solutions backed by 15 years of engineering expertise.",
};

const SolutionsPage = () => {
  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      {/* ── Page Hero ────────────────────────────────────────────────── */}
      <PageHeader
        badge="Our Services"
        heading="Solar Solutions for Every Need"
        subtitle="From simple residential backup to large commercial installations, GoSolar provides end-to-end solar energy solutions backed by 15 years of engineering expertise."
        image="/images/bg/about-us.jpg"
        minHeight="min-h-[360px]"
        align="left"
      />

      {/* ── Solutions Grid ───────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SOLUTIONS.map((sol) => (
              <Link
                key={sol.id}
                href={`/solutions/${sol.slug}`}
                className="group bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="font-heading font-bold text-xl lg:text-2xl text-zinc-900 dark:text-white group-hover:text-[#08AA08] transition-colors leading-tight">
                      {sol.title}
                    </h2>
                    {sol.featured && (
                      <span className="bg-[#08AA08] text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md font-bold shadow-xs">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {sol.description}
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-bold">
                      Key Benefits
                    </div>
                    <ul className="space-y-1.5">
                      {sol.benefits.slice(0, 3).map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-xs text-zinc-500 dark:text-zinc-450"
                        >
                          <span className="text-[#08AA08] font-bold">—</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="px-8 pb-8 pt-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#08AA08] font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn More <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Block ────────────────────────────────────────────── */}
      <section className="bg-zinc-950 text-white py-16 lg:py-24 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#08AA08] font-bold block">
              Our Process
            </span>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl tracking-tight">
              From Assessment to Operation
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                n: "01",
                title: "Site Assessment",
                desc: "Our certified engineers visit your property to survey roof area, structural integrity, panel shading, and existing wiring.",
              },
              {
                n: "02",
                title: "System Design",
                desc: "We build a detailed load-profile simulation model specifying system sizes, 25-year energy yields, and itemized billing budgets.",
              },
              {
                n: "03",
                title: "Installation",
                desc: "Our COREN-registered engineering team completes all physical mounting, wiring, and battery safety setups within 2 to 5 days.",
              },
              {
                n: "04",
                title: "Commissioning",
                desc: "We calibrate the hybrid controls, perform safety load-testing procedures, and configure remote performance dashboard access.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 shadow-sm"
              >
                <div className="font-heading font-bold text-4xl text-[#08AA08]/20 leading-none">
                  {step.n}
                </div>
                <h3 className="font-heading font-bold text-base text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action Panel ─────────────────────────────────────── */}
      <section className="bg-zinc-900 text-white py-16 text-center border-t border-zinc-850 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#064e3b]/5 bg-radial" />
        <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight">
            Not sure which solution is right for you?
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Use our interactive energy calculator to specify your appliance
            load, or request a technical callback to speak directly with an
            electrical engineer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/energy-calculator"
              className="inline-flex items-center justify-center gap-1.5 bg-[#08AA08] hover:bg-[#079907] text-white px-6 py-3 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-md"
            >
              Use Solar Calculator <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-1.5 border border-zinc-700 hover:border-zinc-500 text-zinc-200 px-6 py-3 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-sm bg-zinc-900"
            >
              Speak to an Engineer <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionsPage;
