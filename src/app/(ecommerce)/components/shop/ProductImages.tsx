"use client";
import { IImage } from "@/interfaces/product.interface";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X, ImageOff } from "lucide-react";

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

  // ── No Images Placeholder ──
  if (!hasImages) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-muted/40 border border-dashed border-border flex flex-col items-center justify-center gap-3 select-none">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <ImageOff className="w-5 h-5 text-muted-foreground/50" />
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-xs font-bold text-muted-foreground">No images uploaded</p>
          <p className="text-[10px] text-muted-foreground/60 font-semibold">Use "Update Images" to add product photos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* ── Main Featured Image ── */}
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border/60 bg-muted/20 cursor-zoom-in group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={images[selectedImage]?.url}
          alt={`Product Image ${selectedImage + 1}`}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
          priority
        />

        {/* Expand hint overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Expand className="w-3.5 h-3.5" />
        </div>

        {/* Image counter badge */}
        {images.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
            {selectedImage + 1} / {images.length}
          </div>
        )}

        {/* Arrow nav on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail Strip ── */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150 cursor-pointer ${
                selectedImage === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/60 hover:border-border"
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

      {/* ── Lightbox ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors cursor-pointer z-10"
          >
            <X size={20} />
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-3xl max-h-[85vh] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImage]?.url}
              alt={`Product Image ${selectedImage + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Nav */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};


export default ProductImages;
