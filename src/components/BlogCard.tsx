import { Post } from "@/interfaces/post.interface";
import { formatDate } from "@/utils/helpers";
import { CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

export const BlogCardList: React.FC<{ item: Post }> = ({ item }) => {
  return (
    <div className="flex">
      <div className="size-20 bg-gray-500 overflow-hidden">
        <Image src="" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col w-[calc(100%-5rem)] px-2">
        <Link
          href={`/blog/${item?._id}`}
          className="mb-2 hover:underline"
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

const BlogCard: React.FC<{
  post: Post;
  path: string;
}> = ({ post, path }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full">
        <Link href={`/${path}/${post?._id}`}>
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
        <div className="py-4 px-2 w-full">
          <div className="text-primary text-xl mb-2">
            <Link href={`/${path}/${post?._id}`}>
              <p>{post?.title}</p>
            </Link>
          </div>
          <p className="text-ellipsis line-clamp-2 mb-4">{post?.content}</p>
          <div className="text-sm flex items-center">
            <CalendarCheck size={16} />
            <span className="ml-1">{formatDate(post?.createdAt)}</span>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default BlogCard;
