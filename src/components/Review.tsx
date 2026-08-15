"use client";

import React from "react";
import { ReviewData } from "@/data/reviews";
import { Star, User } from "lucide-react";
import { motion } from "framer-motion";

const Review = () => {
  // Use 4 reviews for a clean 4-column layout matching reference structure
  const featuredReviews = ReviewData.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-xs font-inter">
      {featuredReviews.map((rev, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-card text-card-foreground p-8 flex flex-col justify-between h-[340px] hover:bg-secondary/40 transition-all duration-300 group cursor-default"
        >
          {/* Star Rating */}
          <div className="space-y-4">
            <div className="flex gap-1.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4.5 w-4.5 fill-current shrink-0" />
              ))}
            </div>

            {/* Feedback Content */}
            <blockquote className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground leading-relaxed font-semibold italic">
              "{rev.content}"
            </blockquote>
          </div>

          {/* Reviewer Meta info */}
          <div className="flex items-center gap-3 pt-6 border-t border-border transition-colors">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
              <User className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="space-y-0.5">
              <h5 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors leading-snug">
                {rev.name}
              </h5>
              <p className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider">
                {rev.role}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Review;
