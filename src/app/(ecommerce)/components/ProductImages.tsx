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
      <div className="lg:w-[384px] aspect-square lg:h-[384px] rounded-lg shadow-xl border overflow-hidden">
        <Image
          src={selectedImage}
          alt="image selected"
          width={300}
          height={300}
          priority
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-2 overflow-y-auto scrollbar-hide">
        {images.map((img, i) => (
          <div
            key={i}
            className={`size-14 overflow-hidden rounded-lg cursor-pointer border ${
              selectedImage === img.url ? "border border-black" : ""
            }`}
            onClick={() => handleSelected(img.url)}
          >
            <Image
              src={img.url}
              alt="product"
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
