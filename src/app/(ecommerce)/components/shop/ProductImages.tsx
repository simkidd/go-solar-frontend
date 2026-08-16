"use client";

import { IImage } from "@/interfaces/product.interface";
import React, { useState } from "react";
import Image from "next/image";
import {
  Maximize2,
  X,
  ImageOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ProductImages: React.FC<{
  images: IImage[];
}> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const hasImages = images && images.length > 0;

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!hasImages) {
    return (
      <div className="w-full aspect-[4/3] rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-3 select-none">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
          <ImageOff className="w-5 h-5 text-zinc-400 dark:text-zinc-650" />
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            No images available
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
            Storefront display list empty
          </p>
        </div>
      </div>
    );
  }

  const activeImg = images[selectedImage];

  return (
    <div className="w-full space-y-4 font-inter">
      {/* ── Main Interactive Image Viewer ── */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-150/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10 cursor-zoom-in group select-none"
      >
        {/* Base Standard Image */}
        <Image
          src={activeImg?.url}
          alt={`Product Image ${selectedImage + 1}`}
          fill
          className="object-contain transition-transform duration-300"
          priority
        />

        {/* Floating controls */}
        <div className="absolute top-4 right-4 z-[2]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="h-8 w-8 rounded-full bg-background/80 dark:bg-zinc-900/80 backdrop-blur-xs flex items-center justify-center text-zinc-500 hover:text-primary border border-border/40 shadow-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* ── Scrollable Horizontal Thumbnail Strip ── */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1">
          {images.map((img, index) => (
            <button
              key={img.public_id}
              onClick={() => setSelectedImage(index)}
              className={`relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                selectedImage === index
                  ? "border-primary ring-4 ring-primary/10"
                  : "border-zinc-150 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/10"
              }`}
            >
              <Image
                src={img?.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Premium Lightbox overlay modal ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-55 flex flex-col items-center justify-center select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close trigger */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 h-10 w-10 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-zinc-800 cursor-pointer z-10"
          >
            <X size={18} />
          </button>

          {/* Featured Image slot */}
          <div
            className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImg?.url}
              alt="Zoomed Product view"
              fill
              className="object-contain transition-transform duration-300"
            />
          </div>

          {/* Navigation controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-zinc-900/85 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-zinc-900/85 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Floating counter text */}
          {images.length > 1 && (
            <div className="absolute bottom-6 bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-bold px-4 py-1.5 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
