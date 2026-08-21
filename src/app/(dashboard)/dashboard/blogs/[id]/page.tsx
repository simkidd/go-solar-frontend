import DeletePost from "@/app/(dashboard)/components/DeletePost";
import UpdatePostButton from "@/app/(dashboard)/components/UpdatePostButton";
import { Post } from "@/interfaces/post.interface";
import { getPost, getPosts } from "@/lib/data";
import {
  ArrowLeft,
  CalendarCheck,
  User,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface IPost {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: IPost): Promise<Metadata> => {
  const { id } = await params;
  const post: Post = await getPost(id);

  return {
    title: post?.title ? `${post.title} | Admin View` : "Blog Details",
    description: post?.excerpt || post?.title,
  };
};

export const generateStaticParams = async () => {
  try {
    const posts = await getPosts();

    return posts.map((post: any) => ({
      id: post?._id,
    }));
  } catch (error) {
    console.log(error);
  }
};

const SinglePostPage = async ({ params }: IPost) => {
  const { id } = await params;
  const post: Post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full font-inter space-y-6 max-w-6xl mx-auto py-4">
      {/* Top Navbar Actions */}
      <div className="flex items-center justify-between select-none">
        <Link
          href="/dashboard/blogs"
          className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Editorial List
        </Link>

        <div className="flex items-center gap-2">
          {/* External storefront link */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-9 rounded-xl text-xs cursor-pointer font-bold"
          >
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Post
            </a>
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Post preview (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card text-card-foreground border border-border/80 shadow-xs rounded-2xl p-6 md:p-8 space-y-6">
            {/* Header Content */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                {post?.title}
              </h1>

              {/* Sub header stats */}
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none border-b border-border/40 pb-4">
                <span className="flex items-center gap-1">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                  {formatDate(post?.createdAt)}
                </span>
                <span className="flex items-center gap-1 before:content-['•'] before:mr-3 before:text-zinc-300">
                  <User className="h-4 w-4 text-primary" />
                  {post?.author || "Staff Admin"}
                </span>
              </div>
            </div>

            {/* Banner Cover Image */}
            <div className="relative w-full aspect-video rounded-xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-zinc-200/40 dark:border-zinc-800">
              <Image
                src={post?.image}
                alt={post?.title}
                fill
                priority
                className="object-cover"
                sizes="(max-w-768px) 100vw, 66vw"
              />
            </div>

            {/* Prose Content Section */}
            <article
              className="blog-content-rich text-zinc-750 dark:text-zinc-300 space-y-4 text-sm sm:text-base leading-relaxed pt-2"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </Card>
        </div>

        {/* Right Column: Meta summary & control actions (1/3 width) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card className="bg-card text-card-foreground border border-border/80 shadow-xs rounded-2xl p-6 space-y-6">
            <div className="border-b border-border/40 pb-3 select-none">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Editorial Control Panel
              </h3>
            </div>

            {/* List entries */}
            <div className="space-y-4 text-xs">
              {/* Publish status row */}
              <div className="flex justify-between items-center py-2 border-b border-border/40">
                <span className="font-bold text-muted-foreground uppercase tracking-wider">
                  Publish Status
                </span>
                {post?.isPublished ? (
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider select-none">
                    Published
                  </span>
                ) : (
                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider select-none">
                    Draft
                  </span>
                )}
              </div>

              {/* Category tags row */}
              <div className="flex justify-between items-center py-2 border-b border-border/40">
                <span className="font-bold text-muted-foreground uppercase tracking-wider">
                  Category Tag
                </span>
                {post?.tags?.[0] ? (
                  <span className="bg-primary/10 text-primary border border-primary/20 rounded-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider select-none">
                    {post.tags[0]}
                  </span>
                ) : (
                  <span className="text-zinc-400 font-semibold">-</span>
                )}
              </div>

              {/* Author row */}
              <div className="flex justify-between items-center py-2 border-b border-border/40">
                <span className="font-bold text-muted-foreground uppercase tracking-wider">
                  Author Account
                </span>
                <span className="font-semibold text-foreground select-all">
                  {post?.author || "Staff Admin"}
                </span>
              </div>

              {/* Read time row */}
              <div className="flex justify-between items-center py-2 border-b border-border/40">
                <span className="font-bold text-muted-foreground uppercase tracking-wider">
                  Read Duration
                </span>
                <span className="font-semibold text-foreground flex items-center gap-1 select-none">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  {post?.readTime ? `${post.readTime} mins` : "5 mins"}
                </span>
              </div>

              {/* Date Created row */}
              <div className="flex justify-between items-center py-2 border-b border-border/40">
                <span className="font-bold text-muted-foreground uppercase tracking-wider">
                  Date Created
                </span>
                <span className="font-semibold text-zinc-500 dark:text-zinc-400 select-none">
                  {formatDate(post?.createdAt)}
                </span>
              </div>

              {/* Last Updated row */}
              <div className="flex justify-between items-center py-2 border-b border-border/40">
                <span className="font-bold text-muted-foreground uppercase tracking-wider">
                  Last Modified
                </span>
                <span className="font-semibold text-zinc-500 dark:text-zinc-400 select-none">
                  {formatDate(post?.updatedAt)}
                </span>
              </div>
            </div>

            {/* Bottom Form Edit/Delete Action Row */}
            <div className="pt-2 border-t border-border/40 flex flex-col gap-2.5 select-none">
              <UpdatePostButton post={post} />
              <DeletePost post={post} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
