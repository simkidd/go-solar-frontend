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
    <div className="w-full">
      <BlogList />
    </div>
  );
};

export default BloglistPage;
