import Image from "next/image";
import React from "react";
import banner from "@/assets/images/G11.jpg";

const Cta: React.FC = () => {
  return (
    <div className="container">
      <div className="flex mx-auto w-fit">
        <Image
          src={banner.src}
          alt="cta-image"
          width={banner.width}
          height={banner.height}
          className=""
        />
      </div>
    </div>
  );
};

export default Cta;
