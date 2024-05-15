import CreateBlogPostForm from "@/app/(dashboard)/components/CreateBlogPostForm";
import Link from "next/link";
import React from "react";

const CreatePost = () => {
  return (
    <div className="w-full max-w-[860px] mx-auto py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Add New Post</h3>

        <Link href="/admin/blogs">
          <button className="bg-primary text-white text-sm px-4 py-2">
            View all
          </button>
        </Link>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] py-8 px-6 shadow rounded">
        <CreateBlogPostForm />
      </div>
    </div>
  );
};

export default CreatePost;
