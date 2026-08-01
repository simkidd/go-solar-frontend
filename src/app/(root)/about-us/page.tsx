/* eslint-disable react/no-unescaped-entities */
import React from "react";
import PageHeader from "@/components/PageHeader";
import StatsSection from "@/components/home/StatsSection";
import VisionSection from "@/components/home/VisionSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import CounterSection from "@/components/home/CounterSection";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | GoSolar",
  description:
    "Learn more about GoSolar, our mission, vision, and our specialist leadership team dedicating to clean energy sizing across Nigeria.",
};

const AboutUsPage = () => {
  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Full-bleed Hero Header Banner */}
      <PageHeader
        badge="About GoSolar"
        heading="Powering Nigeria With Reliable Solar Energy"
        subtitle="GoSolar is dedicated to providing sustainable, high-efficiency, and affordable solar power systems for residential properties, workspaces, and industrial settings."
        image="/images/bg/about-us.jpg"
        cta={[
          { label: "Contact Us Today", href: "/contact-us" },
          {
            label: "Calculate Power",
            href: "/energy-calculator",
            variant: "outline",
          },
        ]}
        minHeight="min-h-[420px] md:min-h-[460px]"
      />

      {/* About Company Grid Section */}
      <section className="w-full py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left text + cards */}
              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-3">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
                    Company Profile
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    About GoSolar
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                    Rays of Progress &amp; Solar Success is dedicated to being a
                    leader in the renewable energy industry. Our vision is to
                    provide sustainable and affordable solar energy solutions
                    that empower individuals and businesses to embrace a green,
                    uninterrupted future.
                  </p>
                </div>

                {/* Sub cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Mission */}
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="h-8 w-8 rounded-lg bg-[#08AA08]/10 flex items-center justify-center text-[#08AA08]">
                        <Zap className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                        Our Mission
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        To provide sustainable, modular, and affordable solar
                        energy systems that empower home owners, business
                        managers, and developers across Nigeria.
                      </p>
                    </div>
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mt-2 bg-zinc-200">
                      <Image
                        src="/images/bulb-1.jpg"
                        alt="our mission"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Card 2: Vision */}
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="h-8 w-8 rounded-lg bg-[#08AA08]/10 flex items-center justify-center text-[#08AA08]">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                        Our Vision
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        To build the most reliable clean-energy network in West
                        Africa, sizing micro-grids to secure 99.9% power uptime
                        and eliminate carbon footprints.
                      </p>
                    </div>
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mt-2 bg-zinc-200">
                      <Image
                        src="/images/sun-field.jpg"
                        alt="our vision"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/contact-us">
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#08AA08] hover:bg-[#079907] text-white">
                      Get In Touch With Us
                      <ArrowUpRight className="h-4.5 w-4.5" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right large vertical image */}
              <div className="lg:col-span-4 relative aspect-[3/4] lg:h-[540px] rounded-3xl overflow-hidden bg-zinc-200 shadow-md">
                <Image
                  src="/images/workers.jpg"
                  alt="GoSolar active installations"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter metrics section */}
      <StatsSection />

      {/* Vision & Brand Message (Why Choose Us) */}
      <VisionSection />

      {/* Our Services Section */}
      <section className="w-full py-20 bg-zinc-50 dark:bg-zinc-900/10 border-t border-zinc-150/50 dark:border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
                Our Services
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Our Specialized Services
              </h2>
              <p className="text-sm text-zinc-505 max-w-lg mx-auto leading-relaxed">
                We offer end-to-end solar solutions, managing hardware sourcing,
                structural mounting, and grid synchronization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Solar Products & Sizing",
                  desc: "Shop standard package kits or customize individual clean energy components suited to your facility.",
                  img: "/images/bulb-1.jpg",
                },
                {
                  title: "Battery Storage Sizing",
                  desc: "Configure advanced Lithium or high-performance AGM batteries to carry your hybrid loads seamlessly.",
                  img: "/images/sun-field.jpg",
                },
                {
                  title: "Installation & Mounts",
                  desc: "On-site mounting on roofs or grounds backed by structural safety checks and expert wiring.",
                  img: "/images/workers.jpg",
                },
              ].map((svc) => (
                <div
                  key={svc.title}
                  className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-100">
                    <Image
                      src={svc.img}
                      alt={svc.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-zinc-505 dark:text-zinc-400 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <CounterSection />

      {/* Testimonials Review Slider */}
      <TestimonialSection />

      {/* FAQ & Newsletter segment */}
      <FaqNewsletterSection />
    </div>
  );
};

export default AboutUsPage;
