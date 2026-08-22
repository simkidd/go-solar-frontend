import { Post } from "@/interfaces/post.interface";
import { formatDate } from "@/utils/helpers";
import { CalendarCheck, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const getExcerpt = (post: Post) => {
  if (post.excerpt) return post.excerpt;
  if (!post.content) return "";
  const plainText = post.content.replace(/<[^>]*>/g, "");
  return plainText.length > 150 ? plainText.slice(0, 150) + "..." : plainText;
};

export const BlogCardList: React.FC<{ item: Post }> = ({ item }) => {
  return (
    <div className="flex">
      <div className="size-20 bg-gray-500 overflow-hidden rounded-md">
        <Image
          src={item?.image}
          alt={item?.title}
          className="w-full h-full object-cover"
          width={80}
          height={80}
        />
      </div>
      <div className="flex flex-col w-[calc(100%-5rem)] px-2">
        <Link
          href={`/blog/${item?.slug}`}
          className="mb-2 hover:underline text-ellipsis line-clamp-2 text-sm"
          title={item?.title}
        >
          {item?.title}
        </Link>
        <div className="flex items-center text-sm">
          <CalendarCheck size={18} className="text-primary" />
          <span className="ml-1">March 2, 2024</span>
        </div>
      </div>
    </div>
  );
};

export const BlogCardAdmin: React.FC<{
  post: Post;
}> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-150 dark:border-zinc-800/80 rounded-2xl shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
      {/* Featured Image */}
      <Link
        href={`/dashboard/blogs/${post?._id}`}
        className="block relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
      >
        <Image
          src={post?.image}
          alt={post?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={400}
          height={250}
        />
        {post?.tags?.[0] && (
          <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
            {post.tags[0]}
          </span>
        )}
        {!post?.isPublished && (
          <span className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
            Draft
          </span>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata (Date & Author) */}
          <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <span className="flex items-center gap-1 select-none">
              <CalendarCheck className="h-3.5 w-3.5" />
              {formatDate(post?.createdAt)}
            </span>
            <span className="flex items-center gap-1 select-none">
              <User className="h-3.5 w-3.5" />
              {post?.author || "Staff Admin"}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-zinc-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
            <Link href={`/dashboard/blogs/${post?._id}`}>{post?.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {getExcerpt(post)}
          </p>
        </div>

        {/* Action Link */}
        <div className="pt-2">
          <Link
            href={`/dashboard/blogs/${post?._id}`}
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary/95 transition-colors group/btn"
          >
            Read Article
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const BlogCard: React.FC<{
  post: Post;
}> = ({ post }) => {
  return (
    <div className="w-full">
      <Link href={`/blog/${post?.slug}`}>
        <div className="w-full h-[142px] bg-gray-500 overflow-hidden rounded-t-lg">
          <Image
            src={post?.image}
            alt="post image"
            className="h-full w-full object-cover hover:scale-105"
            style={{ transition: "transform 0.3s ease-in-out" }}
            width={300}
            height={300}
          />
        </div>
      </Link>
      <div className="text-sm flex items-center px-2 py-2">
        <CalendarCheck size={16} />
        <span className="ml-1">{formatDate(post?.createdAt)}</span>
      </div>
      <div className="py-4 px-2 w-full">
        <div className="text-primary text-xl mb-2">
          <Link href={`/blog/${post?.slug}`}>
            <p>{post?.title}</p>
          </Link>
        </div>
        <p className="text-ellipsis line-clamp-2 mb-4">{getExcerpt(post)}</p>
        <Link href={`/blog/${post?.slug}`} className="text-primary">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
