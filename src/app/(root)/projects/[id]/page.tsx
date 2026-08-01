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
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface IProp {
  params: Promise<{ id: string }>;
}

export const generateStaticParams = async () => {
  return PROJECT_ITEMS.map((proj) => ({
    id: proj.id,
  }));
};

const SingleProjectPage = async ({ params }: IProp) => {
  const { id } = await params;
  const project = PROJECT_ITEMS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  // Filter other projects for the bottom "Explore More" list
  const otherProjects = PROJECT_ITEMS.filter((p) => p.id !== id).slice(0, 2);

  return (
    <div className="w-full font-inter bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        badge="Project Showcase"
        heading={project.title}
        subtitle={project.desc}
        image={project.image}
        minHeight="min-h-[420px] md:min-h-[460px]"
      />

      <section className="w-full py-16">
        <div className="container mx-auto px-6 max-w-6xl space-y-12">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {project.location}
              </span>
              <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                {project.date}
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-3xl">
              {project.desc}
            </p>
          </div>

          {/* Media visual block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 h-80 sm:h-96 rounded-3xl overflow-hidden relative bg-zinc-200 shadow-sm border dark:border-zinc-850">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden relative bg-zinc-200 shadow-xs border dark:border-zinc-850 h-full">
                <Image
                  src="/images/bg/contact-bg.jpg"
                  alt="Thum1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden relative bg-zinc-200 shadow-xs border dark:border-zinc-850 h-full">
                <Image
                  src="/images/bg/about-us.jpg"
                  alt="Thum2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Split layout parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            {/* Left Side: Overview & Highlights */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-8 rounded-3xl shadow-xs space-y-6">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Installation Overview
                </h3>
                <p className="text-xs text-zinc-500">
                  Key metrics, location details, and objectives achieved.
                </p>
              </div>

              <div className="space-y-4">
                <ul className="space-y-3.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t dark:border-zinc-850 flex gap-4">
                <Link
                  href={`/contact-us?subject=Installation&project=${project.id}`}
                >
                  <Button className="bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl gap-1.5 text-xs font-semibold px-5">
                    <MessageSquare className="h-4 w-4" />
                    Request Similar Setup
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: Specs & Load capacity */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-8 rounded-3xl shadow-xs space-y-6">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  System Sizing Details
                </h3>
                <p className="text-xs text-zinc-500">
                  Component capacities deployed for this installation.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border dark:border-zinc-850 text-center">
                  <span className="text-[9px] uppercase font-bold text-zinc-400">
                    Inverter
                  </span>
                  <p className="text-sm font-extrabold mt-1 text-zinc-900 dark:text-white">
                    {project.specs.inverter}
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border dark:border-zinc-850 text-center">
                  <span className="text-[9px] uppercase font-bold text-zinc-400">
                    PV Size
                  </span>
                  <p className="text-sm font-extrabold mt-1 text-zinc-900 dark:text-white">
                    {project.specs.pv}
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border dark:border-zinc-850 text-center">
                  <span className="text-[9px] uppercase font-bold text-zinc-400">
                    Battery
                  </span>
                  <p className="text-sm font-extrabold mt-1 text-zinc-900 dark:text-white">
                    {project.specs.battery}
                  </p>
                </div>
              </div>

              {/* What it powers list */}
              <div className="space-y-3 pt-4 border-t dark:border-zinc-850">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Active Connected Loads
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 pl-1">
                  {project.powers.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Explore More Installations Section */}
          <div className="space-y-8 pt-12 border-t dark:border-zinc-850">
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight text-center">
              Explore More Installations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {otherProjects.map((op) => (
                <div
                  key={op.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl shadow-xs flex justify-between items-center"
                >
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#08AA08]">
                      {op.specs.inverter} Setup
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                      {op.title}
                    </h4>
                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {op.location}
                    </p>
                  </div>
                  <Link href={`/projects/${op.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleProjectPage;
