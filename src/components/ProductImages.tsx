"use client";
import Image from "next/image";
import React, { useState } from "react";

const ProductImages: React.FC<{
  images: string[];
}> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);

  const handleSelected = (img: string) => {
    setSelectedImage(img);
  };

  return (
    <div className="w-full grid grid-cols-5 items-center h-[344px] overflow-hidden">
      <div className="col-span-1 flex flex-col items-center gap-2 flex-grow-[0] h-full">
        {images.map((img, i) => (
          <div
            key={i}
            className="size-20 overflow-hidden"
            onClick={() => handleSelected(img)}
          >
            <Image
              src={img}
              alt=""
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="w-full h-full col-span-4 ">
        <Image
          src={selectedImage}
          alt=""
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProductImages;
