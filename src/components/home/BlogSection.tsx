"use client";

import React from "react";
import { motion } from "framer-motion";
import { useBlogPostsQuery } from "@/hooks/queries/useBlogQuery";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BlogSection = ({ posts: initialPosts }: { posts?: any[] }) => {
  const { data: queryPosts = [] } = useBlogPostsQuery();

  const activePosts =
    initialPosts && initialPosts.length > 0
      ? initialPosts
      : queryPosts;

  if (!activePosts || activePosts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-background font-inter">
      <div className="container mx-auto px-4">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12 select-none">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
              Knowledge Centre
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Solar Energy Insights
            </h2>
          </div>
          <Link href="/blog" className="shrink-0">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider h-11 px-8 rounded-full">
              Read Blog
            </Button>
          </Link>
        </div>

        {/* 1px Gap Border Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border shadow-xs">
          {activePosts.slice(0, 3).map((post, index) => {
            const dateStr = new Date(post.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              },
            );
            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card text-card-foreground hover:bg-secondary/40 transition-colors flex flex-col justify-between h-[420px] group cursor-pointer"
              >
                <Link href={`/blog/${post.slug}`} className="flex flex-col justify-between h-full">
                  <div>
                    {/* Cover Image */}
                    <div className="relative block h-48 bg-muted overflow-hidden">
                      <Image
                        src={post.image || "/images/bg/hero-bg.jpg"}
                        alt={post.title}
                        fill
                        sizes="(max-w-768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6 space-y-3">
                      {/* Meta Info */}
                      <div className="flex items-center gap-2 text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{dateStr}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-semibold">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  {/* Read More link */}
                  <div className="p-6 pt-0">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-primary group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1.5">
                      Read More <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
