"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const HomeContactCta = () => {
  return (
    <section className="w-full py-24 bg-white dark:bg-zinc-950 font-inter">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Green Solid Banner */}
          <div className="relative rounded-[24px] bg-linear-to-br from-[#08AA08] to-[#069906] p-8 flex flex-col justify-between text-white shadow-md min-h-[220px]">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight">
                Ready to power your home or business with solar?
              </h3>
              <p className="text-xs text-white/80 max-w-sm leading-relaxed">
                Connect for a detailed sizing consultation and secure 24/7 power
                systems today.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/energy-calculator">
                <Button className="bg-white hover:bg-zinc-100 text-[#08AA08] font-bold text-xs uppercase tracking-wider rounded-xl px-6 h-10 flex items-center gap-1.5 shadow-sm">
                  Let's Get Sized
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: Dark Installer Network Banner */}
          <div className="relative rounded-[24px] bg-zinc-900 p-8 flex flex-col justify-between text-white shadow-md min-h-[220px] overflow-hidden border dark:border-zinc-800">
            {/* Soft glowing mesh background */}
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25"
              style={{ backgroundImage: `url('/images/bg/contact-bg.jpg')` }}
            />
            <div className="absolute inset-0 z-0 bg-linear-to-r from-zinc-950 via-zinc-950/70 to-transparent" />

            <div className="space-y-3 relative z-10">
              <h3 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight">
                Join Our Installer Network
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Partner with GoSolar to scale local installations and deliver
                structural solar projects.
              </p>
            </div>
            <div className="pt-6 relative z-10">
              <Link href="/contact-us?subject=Installer">
                <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl px-6 h-10 flex items-center gap-1.5">
                  Apply Now
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeContactCta;
