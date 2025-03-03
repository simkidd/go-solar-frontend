import { BlogCardList } from "@/components/BlogCard";
import PageHeader from "@/components/PageHeader";
import PostsList from "@/components/PostsList";
import Search from "@/components/Search";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/data";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const pageTitle = "Blogs";

export const metadata: Metadata = {
  title: pageTitle,
};

const BlogsPage = async () => {
  const posts: Post[] = await getPosts();

  if (!posts) {
    notFound();
  }

  return (
    <div className="w-full font-inter">
      <PageHeader
        name="Blog"
        heading="Blog"
        className="bg-blog-bg bg-no-repeat bg-bottom bg-cover"
      />

      <div className="container mx-auto px-2 pt-8 lg:hidden">
        <div className="max-w-xl">
          <Search placeholder="Search a post..." />
        </div>
      </div>
      <section className="lg:py-28 py-14 w-full">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-4 grid-cols-1 ">
            <div className="col-span-3">
              <PostsList posts={posts} />
            </div>

            <div className="col-span-1 lg:pl-4 mt-8 lg:mt-0 py-4">
              <div className="hidden lg:block mb-4">
                <Search placeholder="Search a post..." />
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
