/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Target,
  Handshake,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeContactCta from "@/components/home/HomeContactCta";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about GoSolar, our mission, vision, and our specialist leadership team dedicating to clean energy sizing across Nigeria.",
};

const TEAM_MEMBERS = [
  {
    name: "Adebayo Oladele",
    role: "Managing Director",
    bio: "15 years in renewable energy. Electrical engineer with an MSc in Renewable Energy Systems from the University of Lagos. Founded GoSolar in 2009.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Emeka Okafor",
    role: "Lead Solar Engineer",
    bio: "BSc Electrical Engineering, 12 years experience. Specialises in large-scale hybrid and off-grid system design. Responsible for all technical commissioning.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Fatima Bello",
    role: "Energy Storage Specialist",
    bio: "Joined GoSolar in 2018 with a background in electrochemistry. Nigeria's leading expert in lithium battery storage systems and BMS configuration.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Chukwudi Eze",
    role: "Commercial Solutions Manager",
    bio: "MBA + BEng. Manages GoSolar's commercial and industrial client portfolio. Has delivered over 2MW of commercial solar across Nigeria and West Africa.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Ngozi Adeyemi",
    role: "Customer Experience Manager",
    bio: "Ensures every GoSolar client receives outstanding service from initial enquiry through to post-installation support. 8 years in renewable energy customer service.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
  },
];

const AboutUsPage = () => {
  return (
    <div className="w-full font-inter bg-background text-foreground overflow-hidden">
      {/* ── Page Hero ────────────────────────────────────────────────── */}
      <PageHeader
        badge="About GoSolar"
        heading="Nigeria's Solar Energy Specialists Since 2009"
        subtitle="GoSolar was founded with a single purpose: to make reliable, clean energy accessible to every Nigerian home and business. Today we are the country's most trusted solar energy company, with over 500 successful installations."
        image="/images/bg/about-us.jpg"
        align="left"
        minHeight="min-h-[380px]"
      />

      {/* ── Stats Row ────────────────────────────────────────────────── */}
      <section className="bg-card text-card-foreground border-b border-border/80 py-10  font-inter">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:divide-x divide-border/60">
            {[
              { value: "200+", label: "Installations Completed" },
              { value: "5 MW", label: "Total Capacity Installed" },
              { value: "15+", label: "Years in Business" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((s, idx) => (
              <div
                key={s.label}
                className={`px-4 text-center lg:text-left ${
                  idx > 0 ? "lg:pl-12" : ""
                }`}
              >
                <div className="text-3xl lg:text-4xl font-black text-primary tracking-tight">
                  {s.value}
                </div>
                <div className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mt-1.5 leading-none">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Story ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-background border-b border-border/85">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block ">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight ">
                Built by Engineers, Driven by Purpose
              </h2>
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed max-w-xl font-semibold">
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
                  commercial solar farms. Our technical team holds
                  certifications from Victron Energy, SMA, and the Council for
                  the Regulation of Engineering in Nigeria (COREN).
                </p>
                <p>
                  Our mission has not changed since 2009: to provide every
                  Nigerian with access to clean, reliable, affordable energy.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-xs bg-muted ">
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
                    className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 shadow-2xs "
                  >
                    <div className="font-heading font-black text-2xl text-primary mb-0.5">
                      {milestone.year}
                    </div>
                    <div className="text-xs text-muted-foreground font-semibold">
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
      <section className="py-20 lg:py-28 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-border/85">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-card text-card-foreground border border-border/80 rounded-3xl p-8 space-y-4 shadow-3xs">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block ">
                Our Mission
              </span>
              <h3 className="text-xl font-bold tracking-tight text-foreground ">
                Power Nigeria with Clean Energy
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-semibold">
                To make professional solar energy solutions accessible to every
                Nigerian home and business, reducing dependence on fossil fuels
                and delivering genuine energy independence.
              </p>
            </div>
            <div className="bg-primary text-white rounded-3xl p-8 space-y-4 shadow-xs relative overflow-hidden ">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-950 block">
                Our Vision
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white">
                A Solar-Powered Nigeria
              </h3>
              <p className="text-white/90 text-xs leading-relaxed font-semibold">
                A Nigeria where every household and business has access to
                reliable, clean, affordable electricity — and where solar energy
                is the obvious, default choice.
              </p>
            </div>
            <div className="bg-card text-card-foreground border border-border/80 rounded-3xl p-8 space-y-4 shadow-3xs">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block ">
                Our Promise
              </span>
              <h3 className="text-xl font-bold tracking-tight text-foreground ">
                Quality, Transparency, Results
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-semibold">
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
                color:
                  "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100/40 dark:border-amber-900/30",
              },
              {
                icon: ShieldCheck,
                title: "Uncompromising Quality",
                desc: "We only source equipment from tier-1 global manufacturers.",
                color:
                  "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100/40 dark:border-blue-900/30",
              },
              {
                icon: Handshake,
                title: "Honest Advice",
                desc: "We recommend what works, not what maximises our margin.",
                color:
                  "text-primary bg-primary/5 dark:bg-primary/10 border-primary/10",
              },
              {
                icon: Leaf,
                title: "Environmental Commitment",
                desc: "Every installation contributes to Nigeria's clean energy transition.",
                color:
                  "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/40 dark:border-emerald-900/30",
              },
            ].map((v) => {
              const IconComponent = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-card text-card-foreground border border-border/80 rounded-2xl p-6 space-y-4 shadow-3xs hover:border-primary/20 transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center border ${v.color}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-foreground">
                      {v.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
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
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 ">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
              The People Behind GoSolar
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-card text-card-foreground border border-border/80 rounded-3xl p-6 text-center space-y-4 shadow-3xs hover:border-primary/25 transition-colors"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto bg-zinc-200 border border-border/80 ">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-foreground ">
                    {member.name}
                  </h4>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary ">
                    {member.role}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications & Partners ────────────────────────────────── */}
      <section className="py-14 bg-zinc-50/50 dark:bg-zinc-900/10 border-t border-b border-border/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground block ">
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
                className="bg-card text-card-foreground border border-border/80 px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:border-primary/25 transition-colors  shadow-3xs"
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Block ────────────────────────────────────────────────── */}
      <HomeContactCta
        tagline="Work With Us"
        title="Ready to Work Together?"
        subtitle="Get in touch with our team for a no-obligation consultation and system assessment."
        primaryText="Contact GoSolar"
        primaryLink="/contact-us"
        secondaryText="Calculate System"
        secondaryLink="/energy-calculator"
        bgImage="/images/bg/contact-bg.jpg"
      />
    </div>
  );
};

export default AboutUsPage;
