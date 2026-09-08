"use client";

import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface Partner {
  name: string;
  logo: string;
}

const PARTNERS: Partner[] = [
  { name: "itel", logo: "/images/partners/itel.png" },
  { name: "Felicity Solar", logo: "/images/partners/felicity-solar.png" },
  { name: "Deye", logo: "/images/partners/deye.png" },
  { name: "Cworth Energy", logo: "/images/partners/cworth-energy.png" },
  { name: "Victron Energy", logo: "/images/partners/victron-energy.png" },
  { name: "JinkoSolar", logo: "/images/partners/jinko-solar.png" },
  { name: "Canadian Solar", logo: "/images/partners/canadian-solar.png" },
  { name: "SMA", logo: "/images/partners/sma.png" },
  { name: "COREN", logo: "/images/partners/coren.png" },
];

const PartnerMarquee = () => {
  return (
    <div className="w-full relative overflow-hidden py-4">
      {/* Subtle edge fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-zinc-50/90 dark:from-zinc-900/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-zinc-50/90 dark:from-zinc-900/90 to-transparent z-10 pointer-events-none" />

      <Marquee
        speed={40}
        pauseOnHover={true}
        autoFill={true}
        gradient={false}
        className="py-4 overflow-y-hidden"
      >
        <div className="flex items-center">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="mx-8 md:mx-14 flex items-center justify-center transition-all duration-300 hover:scale-110 select-none opacity-90 hover:opacity-100"
            >
              <div className="relative h-16 md:h-20 w-[160px] md:w-[200px] flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={200}
                  height={64}
                  className="max-h-14 md:max-h-16 w-auto object-contain dark:brightness-110"
                />
              </div>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default PartnerMarquee;
