import BlogCard from "@/components/BlogCard";
import PageHeader from "@/components/PageHeader";
// import Search from "@/components/Search";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/data";
import { Metadata } from "next";

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
      {/* <div>
        <Search placeholder="Search a post..." />
      </div> */}
      <section className="py-28 w-full">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 py-4">
            {posts?.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;
