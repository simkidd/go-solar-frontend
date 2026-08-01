"use client";
import React, { useState } from "react";
import { ArrowUpRight, MapPin, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import { motion } from "framer-motion";

import { PROJECT_ITEMS } from "@/data/projectData";

const ITEMS_PER_PAGE = 4;

const ProjectsPage = () => {
  const [visible, setVisible] = useState(ITEMS_PER_PAGE);

  const showMore = () => setVisible((prev) => prev + ITEMS_PER_PAGE);

  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950">
      {/* Full-bleed Hero Banner */}
      <PageHeader
        badge="Showcase"
        heading={"Our Solar Installations\nAcross Nigeria"}
        subtitle="Explore some of our completed projects. Each designed to deliver reliable, efficient, and affordable solar power. Find inspiration and choose the perfect plan for your home or business."
        image="/images/bg/hero-bg.jpg"
        cta={[{ label: "View Available Packages", href: "/packages" }]}
        minHeight="min-h-[420px] md:min-h-[460px]"
      />

      {/* Projects Grid */}
      <section className="w-full py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECT_ITEMS.slice(0, visible).map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 2) * 0.1 }}
                className="group relative rounded-3xl overflow-hidden bg-zinc-900 aspect-[4/3] shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Project Image */}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20 z-10" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                    <Calendar className="h-3 w-3 text-[#08AA08]" />
                    {project.date}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                    <MapPin className="h-3 w-3 text-[#08AA08]" />
                    {project.location.split("-")[0].trim()}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-3">
                  {/* Spec pills */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[10px] font-bold bg-[#08AA08]/20 border border-[#08AA08]/40 text-[#08AA08] px-2 py-0.5 rounded-full">
                      {project.specs.inverter}
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 border border-white/10 text-white/70 px-2 py-0.5 rounded-full">
                      {project.specs.pv} PV
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 border border-white/10 text-white/70 px-2 py-0.5 rounded-full">
                      {project.specs.battery} Batt
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                    {project.desc}
                  </p>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-bold text-[#08AA08] flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" />
                      Powers Appliances
                    </span>
                    <Link href={`/projects/${project.id}`}>
                      <Button
                        size="sm"
                        className="bg-[#08AA08] hover:bg-[#079907] text-white text-xs font-bold rounded-xl gap-1 px-4"
                      >
                        Get This Plan
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {visible < PROJECT_ITEMS.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={showMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[#08AA08] hover:text-[#08AA08] transition-colors"
              >
                ↓ Load more
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ & Newsletter */}
      <FaqNewsletterSection />
    </div>
  );
};

export default ProjectsPage;
