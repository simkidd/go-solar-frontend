import Marquee from "react-fast-marquee";
import { FaLeaf, FaSeedling, FaSolarPanel, FaSun } from "react-icons/fa6";

const MarqueeComp = () => {
  return (
    <Marquee autoFill pauseOnHover className="h-full">
      <div className="flex items-center gap-2 mx-8">
        <FaSolarPanel className="mr-2" />
        <h4>SunPower Solution</h4>
      </div>
      <div className="flex items-center gap-2 mx-8">
        <FaLeaf className="mr-2" />
        <h4>Green Technology</h4>
      </div>
      <div className="flex items-center gap-2 mx-8">
        <FaSeedling className="mr-2" />
        <h4>SolarSage Initiative</h4>
      </div>
      <div className="flex items-center gap-2 mx-8">
        <FaSun className="mr-2" />
        <h4>Solar Green Energy Project</h4>
      </div>
    </Marquee>
  );
};

export default MarqueeComp;
