import { Post } from "@/interfaces/post.interface";
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
          href={`/blog/${item?.id}`}
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
}> = ({ post }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full">
        <Link href={`/blog/${post?.id}`}>
          <div className="w-full h-[200px] bg-gray-500 overflow-hidden">
            <Image
              src=""
              alt="post image"
              className="h-full w-full object-cover hover:scale-105"
              style={{ transition: "transform 0.3s ease-in-out" }}
            />
          </div>
        </Link>
        <div className="p-4 w-full">
          <div className="text-sm flex mb-1">
            <span className="">Category</span>
          </div>
          <div className="text-primary text-xl mb-4">
            <Link href={`/blog/${post?.id}`}>{post?.title}</Link>
          </div>
          <div className="text-sm flex">
            <span className="">March 23, 2024</span>
          </div>
          <p className="my-4 w-full">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
            fugiat.
          </p>

          <Link href="" className="text-primary">
            Read More
          </Link>
        </div>
      </div>
    </Suspense>
  );
};

export default BlogCard;
