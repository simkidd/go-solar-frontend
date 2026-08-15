/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, ShieldCheck, Zap, Target, Handshake, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | GoSolar",
  description:
    "Learn more about GoSolar, our mission, vision, and our specialist leadership team dedicating to clean energy sizing across Nigeria.",
};

const TEAM_MEMBERS = [
  {
    name: "Adebayo Oladele",
    role: "Managing Director",
    bio: "15 years in renewable energy. Electrical engineer with an MSc in Renewable Energy Systems from the University of Lagos. Founded GoSolar in 2009.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Emeka Okafor",
    role: "Lead Solar Engineer",
    bio: "BSc Electrical Engineering, 12 years experience. Specialises in large-scale hybrid and off-grid system design. Responsible for all technical commissioning.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Fatima Bello",
    role: "Energy Storage Specialist",
    bio: "Joined GoSolar in 2018 with a background in electrochemistry. Nigeria's leading expert in lithium battery storage systems and BMS configuration.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Chukwudi Eze",
    role: "Commercial Solutions Manager",
    bio: "MBA + BEng. Manages GoSolar's commercial and industrial client portfolio. Has delivered over 2MW of commercial solar across Nigeria and West Africa.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Ngozi Adeyemi",
    role: "Customer Experience Manager",
    bio: "Ensures every GoSolar client receives outstanding service from initial enquiry through to post-installation support. 8 years in renewable energy customer service.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
  },
];

const AboutUsPage = () => {
  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      {/* ── Hero Grid Section ───────────────────────────────────────── */}
      <section className="bg-zinc-950 text-white py-20 lg:py-28 relative overflow-hidden">
        {/* Background Image overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/images/bg/about-us.jpg')" }}
        />
        <div className="absolute inset-0 z-10 bg-linear-to-b from-[#064e3b]/85 via-[#064e3b]/70 to-zinc-950" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#08AA08] block">
                About GoSolar
              </span>
              <h1 className="font-heading font-bold text-4xl lg:text-6xl text-white leading-tight tracking-tight">
                Nigeria's Solar Energy Specialists Since 2009
              </h1>
              <p className="text-zinc-300 text-sm lg:text-base leading-relaxed max-w-xl">
                GoSolar was founded with a single purpose: to make reliable,
                clean energy accessible to every Nigerian home and business.
                Today we are the country's most trusted solar energy company,
                with over 500 successful installations and a 98% customer
                satisfaction record.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#08AA08] hover:bg-[#079907] text-white px-6 py-3 font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Work With Us <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-6 py-3 font-semibold text-xs uppercase tracking-widest rounded-xl transition-all"
                >
                  View Our Projects
                </Link>
              </div>
            </div>
            <div className="relative aspect-[3/2] w-full rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=900&h=600&fit=crop&auto=format"
                alt="GoSolar solar farm installation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Row ────────────────────────────────────────────────── */}
      <section className="bg-[#08AA08] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/20">
            {[
              { value: "500+", label: "Installations Completed" },
              { value: "5 MW", label: "Total Capacity Installed" },
              { value: "15", label: "Years in Business" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((s, idx) => (
              <div
                key={s.label}
                className={`px-4 py-6 text-center ${
                  idx >= 2 ? "pt-6 lg:pt-6" : "pb-6 lg:pb-6"
                }`}
              >
                <div className="font-heading font-black text-3xl lg:text-4xl text-zinc-950">
                  {s.value}
                </div>
                <div className="text-xs text-white/80 font-semibold mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Story ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-zinc-950 border-b border-zinc-150/50 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#08AA08] block">
                Our Story
              </span>
              <h2 className="font-heading font-bold text-3xl lg:text-4xl text-zinc-900 dark:text-white tracking-tight">
                Built by Engineers, Driven by Purpose
              </h2>
              <div className="space-y-4 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xl">
                <p>
                  GoSolar was founded in 2009 by Adebayo Oladele, an electrical
                  engineer who had spent years watching Nigerian homes and
                  businesses struggle with unreliable grid electricity and
                  spiralling diesel costs. He knew there was a better way.
                </p>
                <p>
                  Starting with a small team of three engineers in Lagos,
                  GoSolar began by designing and installing residential solar
                  systems in Ikoyi and Victoria Island. Word spread quickly.
                  Within two years, the company had expanded to commercial
                  installations and was delivering projects across Lagos, Abuja,
                  and Port Harcourt.
                </p>
                <p>
                  Today, GoSolar employs over 40 engineers, technicians, and
                  support staff. We have completed more than 500 installations
                  ranging from small residential backup systems to large
                  commercial solar farms. Our technical team holds certifications
                  from Victron Energy, SMA, and the Council for the Regulation of
                  Engineering in Nigeria (COREN).
                </p>
                <p>
                  Our mission has not changed since 2009: to provide every
                  Nigerian with access to clean, reliable, affordable energy.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-md bg-zinc-100">
                <Image
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&h=450&fit=crop&auto=format"
                  alt="GoSolar installation team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { year: "2009", desc: "Company founded in Lagos" },
                  { year: "2015", desc: "First commercial installation" },
                  { year: "2020", desc: "Reached 250 installations" },
                  { year: "2024", desc: "5 MW total capacity milestone" },
                ].map((milestone) => (
                  <div
                    key={milestone.year}
                    className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-5 shadow-2xs"
                  >
                    <div className="font-heading font-black text-2xl text-[#08AA08] mb-0.5">
                      {milestone.year}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      {milestone.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Values ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-zinc-50 dark:bg-zinc-900/10 border-b border-zinc-150/50 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-8 space-y-4 shadow-3xs">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#08AA08] block">
                Our Mission
              </span>
              <h3 className="font-heading font-bold text-xl text-zinc-900 dark:text-white">
                Power Nigeria with Clean Energy
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                To make professional solar energy solutions accessible to every
                Nigerian home and business, reducing dependence on fossil fuels
                and delivering genuine energy independence.
              </p>
            </div>
            <div className="bg-[#08AA08] text-white rounded-3xl p-8 space-y-4 shadow-sm relative overflow-hidden">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-950 block">
                Our Vision
              </span>
              <h3 className="font-heading font-bold text-xl text-white">
                A Solar-Powered Nigeria
              </h3>
              <p className="text-white/80 text-xs leading-relaxed">
                A Nigeria where every household and business has access to
                reliable, clean, affordable electricity — and where solar energy
                is the obvious, default choice.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-8 space-y-4 shadow-3xs">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#08AA08] block">
                Our Promise
              </span>
              <h3 className="font-heading font-bold text-xl text-zinc-900 dark:text-white">
                Quality, Transparency, Results
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                We will always recommend what is genuinely right for your
                situation, install to the highest technical standards, and stand
                behind our work for the long term.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Engineering Excellence",
                desc: "Every system is designed by certified engineers, not just salespeople.",
                color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
              },
              {
                icon: ShieldCheck,
                title: "Uncompromising Quality",
                desc: "We only source equipment from tier-1 global manufacturers.",
                color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
              },
              {
                icon: Handshake,
                title: "Honest Advice",
                desc: "We recommend what works, not what maximises our margin.",
                color: "text-[#08AA08] bg-[#08AA08]/10",
              },
              {
                icon: Leaf,
                title: "Environmental Commitment",
                desc: "Every installation contributes to Nigeria's clean energy transition.",
                color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
              },
            ].map((v) => {
              const IconComponent = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-3xs"
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${v.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {v.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team Section ─────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#08AA08] block">
              Our Team
            </span>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-zinc-900 dark:text-white tracking-tight">
              The People Behind GoSolar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 text-center space-y-4 shadow-3xs"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto bg-zinc-200 border border-zinc-150 dark:border-zinc-800">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    {member.name}
                  </h4>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#08AA08]">
                    {member.role}
                  </p>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications & Partners ────────────────────────────────── */}
      <section className="py-14 bg-zinc-50 dark:bg-zinc-900/10 border-t border-b border-zinc-150/50 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
            Certifications & Partners
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "COREN Registered",
              "Victron Energy Dealer",
              "JinkoSolar Partner",
              "Canadian Solar Partner",
              "SMA Certified Installer",
              "ISO 9001:2015",
              "NABCEP Member",
            ].map((c) => (
              <div
                key={c}
                className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-3xs"
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Block ────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 text-white py-20 lg:py-24 text-center relative overflow-hidden">
        {/* Background Image overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: "url('/images/bg/contact-bg.jpg')" }}
        />
        <div className="absolute inset-0 z-10 bg-linear-to-b from-[#064e3b]/85 via-[#064e3b]/70 to-zinc-950" />

        <div className="relative z-20 max-w-2xl mx-auto px-6 lg:px-8 space-y-6">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl leading-tight">
            Ready to Work Together?
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed max-w-lg mx-auto">
            Get in touch with our team for a no-obligation consultation and system
            assessment.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-[#08AA08] hover:bg-[#079907] text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md cursor-pointer"
            >
              Contact GoSolar <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
