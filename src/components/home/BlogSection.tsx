// components/home/BlogSection.tsx
"use client";
import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";

const BlogSection = ({ posts }: { posts?: any[] }) => {

  if(!posts) return null
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-16"
    >
      <div className="container mx-auto px-2">
        <div className="mb-8 grid lg:grid-cols-2 grid-cols-1">
          <div className="relative">
            <h2 className="text-primary text-2xl font-bold mb-4">
              Latest Blog Posts
            </h2>
            <h2 className="lg:text-5xl text-4xl font-bold mb-4">
              Stay Updated with Our Blog
            </h2>
            <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-8xl absolute lg:-top-20 -top-8 left-0 -z-[1] font-bold">
              Blog
            </div>
          </div>

          <Link href="/blog" className="ml-auto mt-auto">
            <button className="bg-primary text-white py-4 px-8">
              All Articles
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {posts?.slice(0, 3).map((post) => (
            <motion.div
              key={post?._id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
        <div></div>
      </div>
    </motion.section>
  );
};

export default BlogSection;