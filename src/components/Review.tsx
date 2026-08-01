"use client";
import React from "react";
import { ReviewData } from "@/data/reviews";
import { Star, User } from "lucide-react";

const Review = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">
      {ReviewData.map((rev, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md hover:border-[#08AA08]/20 transition-all duration-300"
        >
          {/* Rating */}
          <div className="flex gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current shrink-0" />
            ))}
          </div>

          {/* Feedback Content */}
          <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed font-semibold italic flex-1">
            "{rev.content}"
          </p>

          {/* Reviewer Meta info */}
          <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-850">
            <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-450 shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <h5 className="font-extrabold text-xs text-zinc-900 dark:text-white leading-snug">
                {rev.name}
              </h5>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                {rev.role}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Review;
