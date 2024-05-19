import { Plus } from "lucide-react";
import Link from "next/link";
import BlogList from "../../components/BlogList";

const BloglistPage = async () => {

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
        <BlogList />
      </div>
    </div>
  );
};

export default BloglistPage;
