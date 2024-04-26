"use client";
import { IImage } from "@/interfaces/product.interface";
import Image from "next/image";
import React, { useState } from "react";

const ProductImages: React.FC<{
  images: IImage[];
}> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0].url);

  const handleSelected = (img: string) => {
    setSelectedImage(img);
  };

  return (
    <div className="flex flex-col gap-3 ">
      <div className="w-[384px] h-[384px] rounded-lg shadow-xl border overflow-hidden">
        <Image
          src={selectedImage}
          alt=""
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-2 overflow-auto tailwind-scrollbar-hide">
        {images.map((img, i) => (
          <div
            key={i}
            className={`size-20 overflow-hidden rounded-lg cursor-pointer ${
              selectedImage === img.url ? "border-2 border-black" : ""
            }`}
            onClick={() => handleSelected(img.url)}
          >
            <Image
              src={img.url}
              alt="product"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
