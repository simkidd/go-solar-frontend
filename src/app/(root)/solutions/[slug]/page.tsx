import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { SOLUTIONS } from "@/data/solutions";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  HardDrive,
} from "lucide-react";
import { Metadata } from "next";

interface ISolutionDetail {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  return SOLUTIONS.map((s) => ({
    slug: s.slug,
  }));
};

export const generateMetadata = async ({
  params,
}: ISolutionDetail): Promise<Metadata> => {
  const { slug } = await params;
  const solution = SOLUTIONS.find((s) => s.slug === slug);

  return {
    title: solution?.title || "Solution",
    description:
      solution?.description || "Expert solar solutions for every need.",
  };
};

const SolutionDetailPage = async ({ params }: ISolutionDetail) => {
  const { slug } = await params;
  const solution = SOLUTIONS.find((s) => s.slug === slug);

  if (!solution) {
    notFound();
  }

  // Filter other solutions for the sidebar list
  const otherSolutions = SOLUTIONS.filter((s) => s.slug !== slug).slice(0, 5);

  const faqs = [
    {
      q: `How long does a ${solution.title} installation take?`,
      a: "Typical residential installations take 2–3 days. Larger commercial projects may take 1–2 weeks depending on system complexity and site conditions.",
    },
    {
      q: "Do I need planning permission?",
      a: "In most cases, residential solar in Nigeria does not require planning permission. Commercial installations may need approval from local electrical and building authorities. GoSolar handles all necessary structural assessments.",
    },
    {
      q: "What warranty do I get?",
      a: "Solar panels carry a 25-year linear power output warranty. Inverters are covered for 5 years. Lithium batteries carry a 10-year warranty. GoSolar provides a 12-month workmanship warranty on all installations.",
    },
    {
      q: "Will the system work during a power outage?",
      a: "Hybrid and off-grid setups with lithium battery storage will automatically and seamlessly power your connected loads during utility grid outages. Grid-tied setups without storage automatically disconnect for safety reasons.",
    },
  ];

  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      {/* ── Hero Banner ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[45vh] flex items-end bg-zinc-950 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg/about-us.jpg"
            alt={solution.title}
            fill
            className="object-cover opacity-35"
            priority
          />
        </div>
        {/* Green gradient overlay */}
        <div className="absolute inset-0 z-10 bg-linear-to-b from-[#064e3b]/80 via-[#064e3b]/70 to-black/90" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pb-12 pt-28 w-full space-y-4">
          <div className="flex items-center gap-3">
            <Link
              href="/solutions"
              className="font-mono text-xs uppercase tracking-widest text-[#08AA08] hover:text-[#079907] transition-colors font-bold"
            >
              Solutions
            </Link>
            <span className="font-mono text-xs text-zinc-450 dark:text-zinc-400 uppercase tracking-widest">
              {solution.title}
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white leading-tight tracking-tight">
            {solution.title}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-semibold max-w-xl">
            {solution.subtitle}
          </p>
        </div>
      </section>

      {/* ── Main Layout Body ────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-white dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left Column: Solution Descriptions */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div className="space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#08AA08] font-bold block">
                  Overview
                </span>
                <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white">
                  What's Included
                </h2>
                <p className="text-zinc-550 dark:text-zinc-350 leading-relaxed text-sm sm:text-base">
                  {solution.description}
                </p>
              </div>

              {/* How it works process */}
              <div className="space-y-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#08AA08] font-bold block">
                  Process Workflow
                </span>
                <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white">
                  How It Works
                </h2>
                <div className="space-y-4">
                  {solution.howItWorks.map((step, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border-l-2 border-[#08AA08] rounded-2xl"
                    >
                      <div className="font-mono text-xs font-bold text-[#08AA08] flex-shrink-0 w-6 text-center">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 font-semibold leading-relaxed">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs accordion details */}
              <div className="space-y-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#08AA08] font-bold block">
                  FAQ
                </span>
                <h2 className="font-heading font-bold text-2xl text-zinc-900 dark:text-white">
                  Common Questions
                </h2>
                <div className="border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden divide-y divide-zinc-150 dark:divide-zinc-800">
                  {faqs.map((faq) => (
                    <details
                      key={faq.q}
                      className="group bg-white dark:bg-zinc-900/10"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer font-heading font-bold text-sm text-zinc-850 dark:text-zinc-200 list-none">
                        <span className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-[#08AA08]" />
                          {faq.q}
                        </span>
                        <span className="text-[#08AA08] group-open:rotate-45 transition-transform text-lg">
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed pl-11">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Key Benefits */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-3xs">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#08AA08]" /> Key
                  Benefits
                </h4>
                <ul className="space-y-3">
                  {solution.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      <span className="text-[#08AA08] font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action CTA Card */}
              <div className="bg-zinc-950 text-white rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden border border-zinc-800">
                <div className="absolute inset-0 z-0 bg-[#064e3b]/10 bg-radial" />
                <div className="relative z-10 space-y-4">
                  <h4 className="font-heading font-bold text-sm">
                    Ready to get started?
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Get a free site assessment and custom system proposal from
                    our electrical engineering team.
                  </p>
                  <div className="space-y-2.5 pt-1">
                    <Link
                      href={`/contact-us?subject=SolutionInquiry&solution=${solution.slug}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 bg-[#08AA08] hover:bg-[#079907] text-white px-5 py-2.5 font-bold uppercase tracking-wide text-[10px] rounded-xl transition-all shadow-xs"
                    >
                      Request a Quote <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/energy-calculator"
                      className="inline-flex w-full items-center justify-center gap-1.5 border border-zinc-700 hover:border-zinc-650 text-zinc-200 px-5 py-2.5 font-bold uppercase tracking-wide text-[10px] rounded-xl transition-all shadow-sm bg-zinc-950"
                    >
                      Use Solar Calculator{" "}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Other Solutions */}
              {otherSolutions.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
                  <div className="font-heading font-bold text-xs uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <HardDrive className="h-4 w-4 text-[#08AA08]" /> Other
                    Solutions
                  </div>
                  <ul className="space-y-2">
                    {otherSolutions.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/solutions/${s.slug}`}
                          className="flex items-center gap-2 text-xs text-zinc-550 dark:text-zinc-400 hover:text-[#08AA08] dark:hover:text-[#08AA08] transition-colors py-1 font-semibold"
                        >
                          <span>{s.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Footer Banner ────────────────────────────────────────── */}
      <section className="bg-zinc-950 text-white py-16 text-center border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#064e3b]/5 bg-radial" />
        <div className="max-w-xl mx-auto px-6 relative z-10 space-y-4">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight">
            Start Your Solar Journey Today
          </h2>
          <p className="text-zinc-350 text-xs sm:text-sm leading-relaxed">
            Our certified electrical engineers are ready to assess your
            requirements and design the perfect system.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-[#08AA08] hover:bg-[#079907] text-white px-6 py-3 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-md"
            >
              Get a Free Quote <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionDetailPage;
