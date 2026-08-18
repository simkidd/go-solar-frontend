import React from "react";
import PageHeader from "@/components/PageHeader";
import { PROJECT_ITEMS } from "@/data/projectData";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  HardDrive,
  Zap,
  Info,
  ArrowUpRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface IProp {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  return PROJECT_ITEMS.map((proj) => ({
    slug: proj.id,
  }));
};

const getProjectType = (id: string) => {
  if (
    id.includes("lodge") ||
    id.includes("lounge") ||
    id.includes("bellies") ||
    id.includes("basic")
  ) {
    return "residential";
  }
  if (
    id.includes("commercial") ||
    id.includes("supermarket") ||
    id.includes("owerri")
  ) {
    return "commercial";
  }
  return "hybrid";
};

const getExtendedProjectDetails = (id: string) => {
  const defaults = {
    challenge:
      "High daytime electricity overheads and grid instability were impacting daily operational capabilities and driving generator reliance.",
    solution:
      "GoSolar deployed a hybrid solar-plus-storage system paired with monocrystalline PV arrays and pure sine wave smart inverters.",
    results:
      "Over 75% reduction in daytime power overheads, zero generator noise pollution, and immediate backup during grid outages.",
    equipment: [
      "Smart Hybrid Inverter",
      "Monocrystalline Panels",
      "High-density Lithium Battery bank",
      "AC/DC Protection DB Switchboards",
    ],
    customer: "Private Corporate Client",
    images: ["/images/bg/about-us.jpg", "/images/bg/contact-bg.jpg"],
  };

  const overrides: Record<string, typeof defaults> = {
    "bellies-lounge-5kv": {
      challenge:
        "Grid electricity was unavailable for 18+ hours daily. The homeowner was spending heavy monthly capital on diesel generators to run deep freezers and AC units.",
      solution:
        "GoSolar installed a 5kVA smart hybrid solar system paired with a 12kWp PV array and 15kWh high-density lithium storage battery bank.",
      results:
        "Eliminated daily generator runtime completely. Reduced utility bill costs by 80% while powering deep freezers, washing machines, and active cooling continuously.",
      equipment: [
        "Deye 5kW Hybrid Inverter",
        "12 × 400W Monocrystalline Panels",
        "Lithium Battery bank (15kWh)",
        "Automatic Changeover Switchboard",
      ],
      customer: "Bellies Lounge & Duplex Owner",
      images: ["/images/bg/about-us.jpg", "/images/bg/contact-bg.jpg"],
    },
    "commercial-10kv": {
      challenge:
        "High commercial tariff bands and frequent outages caused disruption in workstation tasks, leading to loss of server connection and high diesel bills.",
      solution:
        "Deployed a 10kVA commercial system with a 12kWp roof-mounted solar array and 20kWh lithium storage bank. Real-time remote performance monitoring integrated.",
      results:
        "Sustained 15 office workstations, servers, and AC systems continuously. Cut overall grid dependency and fuel diesel overheads by 75%.",
      equipment: [
        "Victron MultiPlus-II 10kVA Inverter",
        "30 × 400W Solar Panels",
        "20kWh Lithium Battery rack",
        "Smart Monitoring Node (Victron Cerbo GX)",
      ],
      customer: "Ikeja Tech Hub Plaza",
      images: ["/images/bg/about-us.jpg", "/images/bg/contact-bg.jpg"],
    },
    "hybrid-owerri-12kv": {
      challenge:
        "A busy supermarket outlet experienced frequent inventory spoilage due to persistent cooling failures during long utility outages.",
      solution:
        "Delivered a 12kVA solar supermarket setup. Installed a 15kWp solar array and 30kWh battery bank, prioritized to feed display chillers.",
      results:
        "Ensured zero inventory loss. Slashed generator running costs by 92% and protected point-of-sale systems from voltage spikes.",
      equipment: [
        "SMA Sunny Tripower 12kW Inverter",
        "37 × 400W Panels",
        "30kWh Storage Unit",
        "Surge Protection DB Board",
      ],
      customer: "Douglas Road Supermarket Group",
      images: ["/images/bg/about-us.jpg", "/images/bg/contact-bg.jpg"],
    },
    "basic-lodge-3kv": {
      challenge:
        "Remote working freelancers and students faced constant productivity blocks due to random rolling grid blackouts in the university area.",
      solution:
        "Installed an entry-level 3kVA compact solar setup with a 2.4kWp PV array and 4.8kWh lithium backup battery.",
      results:
        "Provided continuous, noise-free power for laptops, desktop computers, lights, and small refrigerators with instant automatic changeover.",
      equipment: [
        "3.5kVA Hybrid Smart Inverter",
        "6 × 400W Solar Panels",
        "4.8kWh Lithium Battery pack",
        "DC Breaker Unit",
      ],
      customer: "Private Residential Lodge",
      images: ["/images/bg/about-us.jpg", "/images/bg/contact-bg.jpg"],
    },
  };

  return overrides[id] || defaults;
};

const SingleProjectPage = async ({ params }: IProp) => {
  const { slug } = await params;
  const project = PROJECT_ITEMS.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  const type = getProjectType(project.id);
  const extended = getExtendedProjectDetails(project.id);

  // Filter other projects for the bottom list
  const otherProjects = PROJECT_ITEMS.filter((p) => p.id !== slug).slice(0, 3);

  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      {/* ── Hero Banner ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-end bg-zinc-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={project.image || "/images/bg/about-us.jpg"}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-12 pt-12 w-full space-y-4">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="font-mono text-xs uppercase tracking-widest text-[#08AA08] hover:text-[#079907] transition-colors font-bold"
            >
              Projects
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="font-mono text-xs text-zinc-450 dark:text-zinc-400 uppercase tracking-widest">
              {type}
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white leading-tight tracking-tight">
            {project.title}
          </h1>
          <p className="text-zinc-455 dark:text-zinc-400 text-xs sm:text-sm font-mono flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#08AA08]" /> {project.location} •{" "}
            {project.date}
          </p>
        </div>
      </section>

      {/* ── Overview Strip Bar ─────────────────────────────────────── */}
      <section className="bg-zinc-50 dark:bg-zinc-900/10 border-b border-zinc-150 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800 border-l border-r border-zinc-150 dark:border-zinc-800">
            {[
              {
                label: "System Type",
                value: type.charAt(0).toUpperCase() + type.slice(1),
              },
              { label: "System Size", value: project.specs.inverter },
              {
                label: "Location",
                value: project.location.split("-")[0].trim(),
              },
              { label: "Completed", value: project.date },
            ].map((item) => (
              <div key={item.label} className="px-6 py-5 space-y-1">
                <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-bold">
                  {item.label}
                </div>
                <div className="font-heading font-bold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Layout Body ────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-white dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left side case study narrative */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#08AA08] font-bold mb-3 block">
                  Project Overview
                </span>
                <p className="text-zinc-550 dark:text-zinc-350 leading-relaxed text-sm sm:text-base">
                  {project.desc}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#08AA08] font-bold mb-3 block">
                  The Challenge
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white mb-3">
                  What the Client Needed
                </h2>
                <p className="text-zinc-500 dark:text-zinc-450 text-xs sm:text-sm leading-relaxed">
                  {extended.challenge}
                </p>
              </div>

              <div className="bg-zinc-950 text-white rounded-3xl p-8 space-y-4 border border-zinc-800">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#08AA08] font-bold block">
                  GoSolar Solution
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl leading-tight">
                  How We Solved It
                </h2>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  {extended.solution}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#08AA08] font-bold mb-3 block">
                  Outcomes
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white mb-3">
                  Results Achieved
                </h2>
                <p className="text-zinc-500 dark:text-zinc-455 text-xs sm:text-sm leading-relaxed">
                  {extended.results}
                </p>
              </div>

              {/* Gallery display */}
              {extended.images.length > 0 && (
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#08AA08] font-bold mb-5 block">
                    Installation Gallery
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {extended.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-850 border border-zinc-150 dark:border-zinc-800"
                      >
                        <Image
                          src={img}
                          alt={`${project.title} — photo ${i + 1}`}
                          fill
                          className="object-cover hover:scale-102 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side case study sidebar details */}
            <div className="space-y-6">
              {/* Equipment list */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-3xs">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <HardDrive className="h-4 w-4 text-[#08AA08]" /> Equipment
                  Used
                </h4>
                <ul className="space-y-2">
                  {extended.equipment.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      <span className="text-[#08AA08] font-bold">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connected load overview */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-3xs">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-[#08AA08]" /> Connected Loads
                </h4>
                <ul className="space-y-2">
                  {project.powers.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[#08AA08] mt-1.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Client info */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-2">
                <div className="font-heading font-bold text-[10px] uppercase tracking-wide text-zinc-400">
                  Client Property
                </div>
                <div className="text-zinc-850 dark:text-zinc-200 text-xs font-semibold">
                  {extended.customer}
                </div>
              </div>

              {/* Sidebar Action CTA Card */}
              <div className="bg-zinc-950 text-white rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden border border-zinc-800">
                <div className="absolute inset-0 z-0 bg-[#064e3b]/10 bg-radial" />
                <div className="relative z-10 space-y-3">
                  <h4 className="font-heading font-bold text-sm">
                    Similar Project?
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Get a customized engineering design and pricing audit for a
                    system like this one today.
                  </p>
                  <div className="pt-1">
                    <Link
                      href={`/contact-us?subject=QuoteRequest&project=${project.id}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 bg-[#08AA08] hover:bg-[#079907] text-white px-5 py-2.5 font-bold uppercase tracking-wide text-[10px] rounded-xl transition-all shadow-xs"
                    >
                      Request a Quote <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related case study recommendations footer ─────────────── */}
      {otherProjects.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900/25 py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
            <h2 className="font-heading font-bold text-xl lg:text-2xl text-zinc-900 dark:text-white tracking-tight">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={p.image || "/images/bg/about-us.jpg"}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[#08AA08] font-bold">
                      {p.specs.inverter} Capacity
                    </div>
                    <h3 className="font-heading font-bold text-zinc-900 dark:text-white group-hover:text-[#08AA08] transition-colors line-clamp-1 text-sm leading-snug">
                      {p.title}
                    </h3>
                    <div className="text-[10px] text-zinc-400 font-mono pt-1">
                      {p.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SingleProjectPage;
