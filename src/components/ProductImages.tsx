"use client";
import { Product } from "@/interfaces/product.interface";
import Image from "next/image";
import React, { useState } from "react";

const ProductImages: React.FC<{
  product: Product;
}> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);

  const handleSelected = (img: string) => {
    setSelectedImage(img);
  };

  return (
    <div className="border w-full">
      <div className="w-full h-[380px] p-4">
        <Image
          src={selectedImage}
          alt=""
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex">
        {product?.images.map((img, i) => (
          <div
            key={i}
            className="size-28 "
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
    </div>
  );
};

export default ProductImages;
