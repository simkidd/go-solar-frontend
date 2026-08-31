"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PROJECT_ITEMS } from "@/data/projectData";
import { Search, ArrowUpRight, MapPin } from "lucide-react";

const CATEGORIES = [
  "All",
  "Residential",
  "Commercial",
  "Industrial",
  "Hybrid",
  "Battery",
];

const ProjectsPageClient = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

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

  const filtered = PROJECT_ITEMS.filter((p) => {
    const type = getProjectType(p.id);
    const matchesCategory =
      activeCategory === "All" ||
      type === activeCategory.toLowerCase() ||
      p.specs.inverter.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured project (the first item)
  const featured = PROJECT_ITEMS[0];

  return (
    <>
      {/* ── Featured Project Case Study ────────────────────────────── */}
      {featured && activeCategory === "All" && search === "" && (
        <section className="py-12 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-150 dark:border-zinc-850">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#08AA08] font-bold block">
              Featured Case Study
            </span>
            <Link
              href={`/projects/${featured.id}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-80 bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={featured.image || "/images/bg/about-us.jpg"}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-zinc-950/20" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#08AA08]/10 text-[#08AA08] text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md font-bold">
                    {getProjectType(featured.id)}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    {featured.specs.inverter} Setup
                  </span>
                </div>
                <h2 className="font-heading font-bold text-2xl lg:text-3xl text-zinc-900 dark:text-white group-hover:text-[#08AA08] transition-colors leading-tight">
                  {featured.title}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  {featured.desc}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 border border-zinc-100 dark:border-zinc-800/80 rounded-xl">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-1 font-bold">
                      PV Generator
                    </div>
                    <div className="font-heading font-bold text-[#08AA08] text-sm">
                      {featured.specs.pv}
                    </div>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 border border-zinc-100 dark:border-zinc-800/80 rounded-xl">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-1 font-bold">
                      Storage Backup
                    </div>
                    <div className="font-heading font-bold text-zinc-850 dark:text-zinc-200 text-sm">
                      {featured.specs.battery}
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#08AA08] font-bold inline-flex items-center gap-1">
                    View Case Study <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── Filters and Projects Grid ─────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
          {/* Controls toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-550" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:border-[#08AA08] focus:ring-2 focus:ring-[#08AA08]/20 transition-all text-zinc-800 dark:text-zinc-200"
              />
            </div>
            <div className="flex gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#08AA08] text-white shadow-xs font-bold"
                      : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-650"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid display */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30">
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                No projects found matching your filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={project.image || "/images/bg/about-us.jpg"}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-zinc-950/20" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#08AA08]/90 backdrop-blur-xs text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md font-bold">
                          {getProjectType(project.id)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-[10px] text-zinc-450 dark:text-zinc-400 font-mono">
                        <span className="font-bold">
                          {project.specs.inverter} Rating
                        </span>
                        <span>{project.date}</span>
                      </div>
                      <h3 className="font-heading font-bold text-zinc-900 dark:text-white text-base leading-snug group-hover:text-[#08AA08] transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-450 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-[#08AA08]" />{" "}
                        {project.location}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {project.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Call to Action Banner ─────────────────────────────────── */}
      <section className="bg-zinc-950 text-white py-16 text-center border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#064e3b]/5 bg-radial" />
        <div className="max-w-xl mx-auto px-6 relative z-10 space-y-4">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight">
            Want to see your project here?
          </h2>
          <p className="text-zinc-350 text-xs sm:text-sm leading-relaxed">
            Join hundreds of satisfied residential homeowners and corporate
            properties powered by GoSolar across Nigeria.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-[#08AA08] hover:bg-[#079907] text-white px-6 py-3 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-md"
            >
              Get a Quote <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectsPageClient;
