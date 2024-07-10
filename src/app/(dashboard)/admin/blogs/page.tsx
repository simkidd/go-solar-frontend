import { Metadata } from "next";
import BlogList from "../../components/BlogList";
import CreatePostButton from "../../components/CreatePostButton";

const pageTitle = "Blog posts";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const BloglistPage = async () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Blog Posts</h3>

        <CreatePostButton />
      </div>
      <div className="w-full mb-8">
        <BlogList />
      </div>
    </div>
  );
};

export default BloglistPage;
