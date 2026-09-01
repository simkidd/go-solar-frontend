"use client";

import React, { useState } from "react";
import { User, Play, Video, Quote, X } from "lucide-react";
import { useReviewsQuery } from "@/hooks/queries/useReviewsQuery";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { IReview } from "@/interfaces/review.interface";

const Review = ({ reviews }: { reviews: IReview[] }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Helper to convert YouTube watch link to embed link
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtube.com")) {
        const v = parsed.searchParams.get("v");
        if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
      }
      if (parsed.hostname.includes("youtu.be")) {
        const id = parsed.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
    } catch (_) {}
    return url;
  };

  const isEmbeddable = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Helper to extract video thumbnail URL for YouTube and local files
  const getVideoThumbnail = (url: string) => {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtube.com")) {
        const v = parsed.searchParams.get("v");
        if (v) return `https://img.youtube.com/vi/${v}/hqdefault.jpg`;
      }
      if (parsed.hostname.includes("youtu.be")) {
        const id = parsed.pathname.slice(1);
        if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }

      // If it is a Cloudinary video file, replace the extension with .jpg
      const extensionIndex = url.lastIndexOf(".");
      if (extensionIndex !== -1) {
        const base = url.substring(0, extensionIndex);
        return `${base}.jpg`;
      }
    } catch (_) {}
    return "";
  };

  return (
    <>
      <div className="w-full relative py-8 px-2 font-inter ">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
          loop={reviews.length > 2}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: {
              slidesPerView: 1.5,
              centeredSlides: true,
            },
            768: {
              slidesPerView: 2,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 3,
              centeredSlides: true,
            },
          }}
          modules={[Autoplay, Pagination]}
          className="swiper-testimonials !pb-14"
        >
          {reviews.map((rev: any, index: number) => {
            const isVideo = !!rev.videoUrl;

            return (
              <SwiperSlide
                key={index}
                className="transition-all duration-500 py-6 px-1"
              >
                {({ isActive }) => (
                  <div
                    onClick={
                      isVideo ? () => setSelectedVideo(rev.videoUrl) : undefined
                    }
                    className={`h-[340px] rounded-3xl p-8 border flex flex-col justify-between transition-all duration-500 cursor-pointer relative overflow-hidden group ${
                      isActive
                        ? "scale-100 lg:scale-105 opacity-100 z-10 shadow-xl border-primary"
                        : "scale-98 lg:scale-95 opacity-50 blur-[0.4px] border-border/80"
                    } ${
                      isVideo
                        ? "bg-zinc-950 text-white border-zinc-800"
                        : "bg-white dark:bg-zinc-900/60 text-foreground"
                    }`}
                  >
                    {/* Background Preview Thumbnail for Video Reviews */}
                    {isVideo && (
                      <div className="absolute inset-0 w-full h-full z-0  pointer-events-none">
                        <img
                          src={getVideoThumbnail(rev.videoUrl)}
                          alt="Video Preview"
                          className="w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700 brightness-[0.35]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      </div>
                    )}

                    {/* Header: Visual type indicator */}
                    <div className="flex justify-between items-start gap-4 z-10">
                      {isVideo ? (
                        <div className="h-7 w-7 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center border border-primary/10">
                          <Video className="h-3.5 w-3.5 text-primary" />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center border border-primary/10">
                          <Quote className="h-3.5 w-3.5 text-primary" />
                        </div>
                      )}

                      {!isVideo && (
                        <span className="text-zinc-100 dark:text-zinc-800 font-serif text-6xl leading-none absolute top-4 right-6 pointer-events-none opacity-40 group-hover:scale-110 transition-transform">
                          ”
                        </span>
                      )}
                    </div>

                    {/* Testimonial body */}
                    <div className="flex-1 flex items-center justify-center my-6 z-10">
                      {isVideo ? (
                        // Clean video testimonial visual card (no written content)
                        <div className="space-y-3 text-center">
                          <div className="h-14 w-14 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto border border-white/20 backdrop-blur-md group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-lg relative">
                            <span className="absolute -inset-1.5 rounded-full bg-primary/25 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Play className="h-6 w-6 fill-current shrink-0" />
                          </div>
                        </div>
                      ) : (
                        // Testimonial quote card details
                        <blockquote className="text-xs sm:text-sm leading-relaxed font-semibold italic text-muted-foreground group-hover:text-foreground text-left w-full">
                          "{rev.content}"
                        </blockquote>
                      )}
                    </div>

                    {/* Footer: User Profile details */}
                    <div className="space-y-4 pt-4 border-t border-zinc-100/10 dark:border-zinc-800/80 z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                            isVideo
                              ? "bg-zinc-800 border-zinc-700 text-zinc-300 group-hover:border-primary/40"
                              : "bg-muted border-border text-muted-foreground group-hover:border-primary/40"
                          }`}
                        >
                          <User className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5 text-left">
                          <h5
                            className={`font-extrabold text-xs transition-colors ${
                              isVideo
                                ? "text-white group-hover:text-primary"
                                : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {rev.name}
                          </h5>
                          <p
                            className={`text-[9px] font-extrabold uppercase tracking-wider ${
                              isVideo
                                ? "text-zinc-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {rev.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Video Testimonial Play Dialog */}
      <Dialog
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      >
        <DialogContent
          hideCloseButton={true}
          className="sm:max-w-[720px] p-0 overflow-visible bg-black text-white border-none rounded-2xl aspect-video flex items-center justify-center"
        >
          <DialogTitle className="sr-only">Video Testimonial</DialogTitle>

          {/* Custom Close Button positioned above the video container top right */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute -top-10 -right-2 sm:-right-8 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer outline-none border border-white/10"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {selectedVideo &&
            (isEmbeddable(selectedVideo) ? (
              <iframe
                src={getEmbedUrl(selectedVideo)}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={selectedVideo}
                autoPlay
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
              />
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Review;
