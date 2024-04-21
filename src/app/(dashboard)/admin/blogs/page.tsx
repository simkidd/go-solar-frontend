import BlogCard from "@/components/BlogCard";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/data";
import { Plus } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";

const BloglistPage = async () => {
  const posts: Post[] = await getPosts();

  console.log("post admin:", posts);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Blog Posts</h3>
        <div>
          <Link href="/admin/blogs/create">
            <button className="bg-primary text-white px-4 py-2 text-sm flex items-center">
              <Plus className="mr-2" size={16} />
              Create New
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] shadow mb-4">
        <div className="flex items-center py-4 px-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border focus:outline-none px-2 py-1 w-full max-w-md"
          />
        </div>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] shadow">
        <div className="grid grid-cols-3 gap-2 py-4 px-4">
          {posts?.length === 0 ? (
            <div className="col-span-4">
              <p>No post yet</p>
            </div>
          ) : (
            <Suspense fallback={<div>Loading posts...</div>}>
              {posts?.map((post) => (
                <BlogCard key={post._id} post={post} path="admin/blogs" />
              ))}
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloglistPage;
