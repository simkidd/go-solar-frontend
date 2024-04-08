import Link from "next/link";
import React from "react";
import Marquee from "react-fast-marquee";
import { FaLeaf, FaSeedling, FaSolarPanel, FaSun } from "react-icons/fa6";

const MarqueeComp = () => {
  return (
    <Marquee autoFill pauseOnHover className="h-full">
      <Link href="/solar-solutions" className="flex items-center gap-2 mx-8">
        <FaSolarPanel className="mr-2" />
        <h4>SunPower Solution</h4>
      </Link>
      <Link href="/green-technology" className="flex items-center gap-2 mx-8">
        <FaLeaf className="mr-2" />
        <h4>Green Technology</h4>
      </Link>
      <Link href="/solar-sage-initiative" className="flex items-center gap-2 mx-8">
        <FaSeedling className="mr-2" />
        <h4>SolarSage Initiative</h4>
      </Link>
      <Link href="/solar-energy-projects" className="flex items-center gap-2 mx-8">
        <FaSun className="mr-2" />
        <h4>Solar Green Energy Project</h4>
      </Link>
    </Marquee>
  );
};

export default MarqueeComp;
