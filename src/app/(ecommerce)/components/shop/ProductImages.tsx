"use client";
import { IImage } from "@/interfaces/product.interface";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FullscreenIcon, X } from "lucide-react";

const ProductImages: React.FC<{
  images: IImage[];
}> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      {/* Thumbnails */}
      {images && images.length > 0 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto scrollbar-hide shrink-0 lg:w-20">
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                selectedImage === index
                  ? "border-[#08AA08] dark:border-white shadow-xs"
                  : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={img?.url || "/placeholder-image.jpg"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 cursor-pointer">
        <Image
          src={images[selectedImage]?.url || "/placeholder-image.jpg"}
          alt={`Product Image ${selectedImage + 1}`}
          fill
          className="object-contain p-6"
          onClick={openModal}
          priority
        />

        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white p-2.5 rounded-full hover:bg-black/85 transition-colors">
          <FullscreenIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Full-Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-4xl h-full max-h-[90vh]">
            <Image
              src={images[selectedImage]?.url || "/placeholder-image.jpg"}
              alt={`Product Image ${selectedImage + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
