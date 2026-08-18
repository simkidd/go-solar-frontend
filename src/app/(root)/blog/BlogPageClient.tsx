"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/interfaces/post.interface";
import { Search, ArrowUpRight, Clock, User, BookOpen } from "lucide-react";

interface BlogPageClientProps {
  initialPosts: Post[];
}

const CATEGORIES = [
  "All",
  "Solar Energy",
  "Batteries",
  "Inverters",
  "Solar Installation",
  "Maintenance",
  "Buying Guides",
  "Renewable Energy",
];

const BlogPageClient: React.FC<BlogPageClientProps> = ({ initialPosts }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = initialPosts.filter((p) => {
    const matchCat =
      activeCategory === "All" ||
      p.tags.some(
        (t) =>
          t.toLowerCase() === activeCategory.toLowerCase() ||
          t.toLowerCase().includes(activeCategory.toLowerCase())
      );
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Determine the featured article (the first post)
  const featured = initialPosts[0];

  // Rest of the articles in grid view
  const rest = filtered.filter(
    (p) => p._id !== featured?._id || search !== "" || activeCategory !== "All"
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  const getExcerpt = (content: string) => {
    if (!content) return "";
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > 120 ? plainText.slice(0, 120) + "..." : plainText;
  };

  const getReadTime = (content: string) => {
    if (!content) return 5;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const getCategoryCount = (catName: string) => {
    return initialPosts.filter((p) =>
      p.tags.some(
        (t) =>
          t.toLowerCase() === catName.toLowerCase() ||
          t.toLowerCase().includes(catName.toLowerCase())
      )
    ).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* ── Main Feed ──────────────────────────────────────────────── */}
        <div className="flex-1 space-y-8">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-550" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-50/50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:border-[#08AA08] focus:ring-2 focus:ring-[#08AA08]/20 transition-all text-zinc-800 dark:text-zinc-200"
            />
          </div>

          {/* Categories Pill List */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setActiveCategory(c);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all cursor-pointer ${
                  activeCategory === c
                    ? "bg-[#08AA08] text-white shadow-xs font-bold"
                    : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-650"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Featured Article showcase */}
          {featured && activeCategory === "All" && search === "" && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900/40 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative overflow-hidden aspect-video md:aspect-auto min-h-[260px] bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={featured.image || "/images/bg/about-us.jpg"}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#08AA08]/10 text-[#08AA08] text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md font-bold">
                      Featured
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                      {featured.tags[0] || "Solar insights"}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-xl lg:text-2xl text-zinc-900 dark:text-white group-hover:text-[#08AA08] transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                    {getExcerpt(featured.content)}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-400 pt-2 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> {featured.author}
                    </span>
                    <span>•</span>
                    <span>{formatDate(featured.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {getReadTime(featured.content)} min read
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid view list */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30">
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                No articles found. Try a different search query or select another category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(search !== "" || activeCategory !== "All" ? filtered : rest).map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={post.image || "/images/bg/about-us.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#08AA08] font-bold">
                          {post.tags[0] || "Solar insights"}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {getReadTime(post.content)} min read
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-zinc-900 dark:text-white text-base leading-snug group-hover:text-[#08AA08] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {getExcerpt(post.content)}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-2 flex items-center gap-2 text-[10px] text-zinc-400 font-mono border-t border-zinc-50 dark:border-zinc-800/60 mt-auto">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Sidebar Column ─────────────────────────────────────────── */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          {/* Recent articles list */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-3xs">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#08AA08]" /> Recent Articles
            </h4>
            <div className="space-y-4">
              {initialPosts.slice(0, 5).map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="flex gap-3 group"
                >
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                    <Image
                      src={post.image || "/images/bg/about-us.jpg"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-[#08AA08] font-bold block uppercase tracking-wider">
                      {post.tags[0] || "Solar"}
                    </span>
                    <span className="text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-[#08AA08] transition-colors leading-snug line-clamp-2 font-semibold">
                      {post.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories count list */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-3xs">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-1">
              {CATEGORIES.slice(1).map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setActiveCategory(c)}
                    className={`w-full text-left flex items-center justify-between py-2 px-2 text-xs rounded-lg transition-colors cursor-pointer ${
                      activeCategory === c
                        ? "bg-[#08AA08]/10 text-[#08AA08] font-bold"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    <span>{c}</span>
                    <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold">
                      {getCategoryCount(c)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Calculator CTA Card */}
          <div className="bg-zinc-950 text-white rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden border border-zinc-850">
            <div className="absolute inset-0 z-0 bg-[#064e3b]/10 bg-radial" />
            <div className="relative z-10 space-y-3">
              <h4 className="font-heading font-bold text-sm">Calculate Solar Load</h4>
              <p className="text-zinc-300 text-xs leading-relaxed">
                Determine your battery, panels, and inverter ratings using our free interactive sizing tool.
              </p>
              <div className="pt-1">
                <Link
                  href="/energy-calculator"
                  className="inline-flex w-full items-center justify-center gap-1.5 bg-[#08AA08] hover:bg-[#079907] text-white px-5 py-2.5 font-bold uppercase tracking-wide text-[10px] rounded-xl transition-all shadow-xs"
                >
                  Launch Calculator <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPageClient;
