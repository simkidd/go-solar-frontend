"use client";
import React from "react";
import { motion } from "framer-motion";
import { useBlogPostsQuery } from "@/hooks/queries/useBlogQuery";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MOCK_FALLBACK_POSTS = [
  {
    _id: "mock-1",
    title: "The Future of Solar Energy in Nigeria: 2026 Sizing Trends",
    content:
      "With grid tariffs rising, residential complexes are switching to smart hybrid lithium storage walls. Here is a breakdown of what sizing configurations offer the highest return on investment.",
    image: "/images/bg/commercial-solar.jpg",
    slug: "the-future-of-solar-energy-in-nigeria",
    createdAt: "2026-08-01T12:00:00Z",
  },
  {
    _id: "mock-2",
    title: "Why High-Capacity Lithium-Iron (LiFePO4) Outlasts Gel Batteries",
    content:
      "Modern solar designs require high DoD (Depth of Discharge). We test cycle degradation under Nigerian heat cycles to show why prismatic cells prevail.",
    image: "/images/bg/residential-solar.jpg",
    slug: "why-lifepo4-outlasts-gel-batteries",
    createdAt: "2026-07-25T12:00:00Z",
  },
  {
    _id: "mock-3",
    title: "Reducing Workplace Overhead with Smart Sizing Analytics",
    content:
      "Supermarkets and medical offices consume heavy day-time loads. Learn how rooftop monocrystalline panel configurations directly bypass diesel costs.",
    image: "/images/bg/contact-bg.jpg",
    slug: "reducing-workplace-overhead",
    createdAt: "2026-07-12T12:00:00Z",
  },
];

const BlogSection = ({ posts: initialPosts }: { posts?: any[] }) => {
  const { data: queryPosts = [] } = useBlogPostsQuery();

  const activePosts =
    initialPosts && initialPosts.length > 0
      ? initialPosts
      : queryPosts && queryPosts.length > 0
        ? queryPosts
        : MOCK_FALLBACK_POSTS;

  return (
    <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/10 font-inter border-b border-zinc-150 dark:border-zinc-850">
      <div className="container mx-auto px-4 space-y-16">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 ">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
              Insights & Updates
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Insights & Updates from GoSolar
            </h2>
            <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
              Stay informed with our technical reviews, structural sizing
              calculations, and system security tips.
            </p>
          </div>
          <Link href="/blog" className="shrink-0">
            <Button
              variant="outline"
              className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 h-10 px-5"
            >
              Read Blog
            </Button>
          </Link>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePosts.slice(0, 3).map((post) => {
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
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between h-full group"
              >
                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block h-48 bg-zinc-100 overflow-hidden"
                  >
                    <Image
                      src={post.image || "/images/bg/hero-bg.jpg"}
                      alt={post.title}
                      fill
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{dateStr}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="block text-sm font-extrabold text-zinc-900 dark:text-white hover:text-primary transition-colors leading-snug line-clamp-2"
                    >
                      {post.title}
                    </Link>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-[#079907] hover:bg-transparent font-bold text-[10px] uppercase tracking-wider p-0 h-auto flex items-center gap-1.5"
                    >
                      Read More
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
