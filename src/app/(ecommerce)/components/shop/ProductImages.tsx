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
    <div className="w-fit lg:w-full mx-auto">
      {/* Main Image */}
      <div className="relative h-96 aspect-square rounded-lg overflow-hidden cursor-pointer">
        <Image
          src={images[selectedImage]?.url || "/placeholder-image.jpg"}
          alt={`Product Image ${selectedImage + 1}`}
          width={300}
          height={300}
          className="object-cover w-full h-full"
          onClick={openModal}
          priority
        />

        <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors">
          <FullscreenIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {images.map((img, index) => (
          <div
            key={index}
            className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 ${
              selectedImage === index ? "border-primary" : "border-transparent"
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <Image
              src={img.url}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        ))}
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
