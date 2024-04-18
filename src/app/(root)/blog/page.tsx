import BlogCard, { BlogCardList } from "@/components/BlogCard";
import PageHeader from "@/components/PageHeader";
import Search from "@/components/Search";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/data";
import { Metadata } from "next";
import { Suspense } from "react";

const pageTitle = "Blogs";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const BlogsPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const posts: Post[] = await getPosts();
  const query = searchParams?.query || "";

  return (
    <div className="w-full font-inter">
      <PageHeader name="Blog" />

      <section className="py-28 w-full">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-4 grid-cols-1 ">
            {posts?.length === 0 ? (
              <div className="col-span-3">
                <p>No post yet</p>
              </div>
            ) : (
              <div className="col-span-3">
                <Suspense fallback={<div>Loading posts...</div>}>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-6 py-4 lg:pr-4">
                    {posts?.map((post) => (
                      <BlogCard key={post._id} post={post} />
                    ))}
                  </div>
                </Suspense>
              </div>
            )}
            <div className="col-span-1 lg:pl-4 mt-8 lg:mt-0 py-4">
              <div>
                <Search placeholder="Search a post..." />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
                  About Us
                </h2>
              </div>
              <div className="w-full">
                <h2 className="text-lg font-semibold mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
                  Recent Post
                </h2>

                <div className="w-full flex flex-col space-y-2">
                  {posts?.slice(0, 3).map((item) => (
                    <BlogCardList key={item?._id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;
