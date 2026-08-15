import PageHeader from "@/components/PageHeader";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/data";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog | GoSolar",
  description:
    "Stay informed with the latest solar energy guides, industry insights, calculation tips, and clean energy news from Nigeria's top engineers.",
};

const BlogsPage = async () => {
  const posts: Post[] = await getPosts();

  if (!posts) {
    notFound();
  }

  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      <PageHeader
        badge="Knowledge Centre"
        heading="Solar Energy Insights"
        subtitle="Expert guides, technical articles, and practical advice on solar energy, batteries, and energy independence for Nigeria."
        image="/images/bg/about-us.jpg"
        minHeight="min-h-[360px]"
        align="left"
      />

      <BlogPageClient initialPosts={posts} />
    </div>
  );
};

export default BlogsPage;
