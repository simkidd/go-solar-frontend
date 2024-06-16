import Image from "next/image";
import React from "react";
import banner from "@/assets/images/G11.jpg";

const Cta: React.FC = () => {
  return (
    <div>
      <div className="w-full bg-gray-500 lg:h-[180px]">
        <Image
          src={banner.src}
          alt="cta-image"
          width={banner.width}
          height={banner.height}
        />
      </div>
    </div>
  );
};

export default Cta;
