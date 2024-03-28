import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeComp = () => {
  return (
    <Marquee autoFill pauseOnHover className="h-full">
      <h4 className="mx-4">SunPower Solution</h4>
      <h4 className="mx-4">Green Technology</h4>
      <h4 className="mx-4">SolarSage Initiative</h4>
      <h4 className="mx-4">Solar Green Energy Project</h4>
    </Marquee>
  );
};

export default MarqueeComp;
