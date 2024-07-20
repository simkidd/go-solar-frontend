"use client";
import { IImage } from "@/interfaces/product.interface";
import Image from "next/image";
import React, { useState } from "react";
import ImageGallery from "react-image-gallery";

const ProductImages: React.FC<{
  images: IImage[];
}> = ({ images }) => {
  return (
    <div className="w-full">
      <ImageGallery
        items={images.map((img) => ({
          original: img.url,
          thumbnail: img.url,
          loading: "lazy",
        }))}
        showBullets={false}
        showNav={false}
        autoPlay={false}
        showPlayButton={false}
        infinite
      />
    </div>
  );
};

export default ProductImages;
