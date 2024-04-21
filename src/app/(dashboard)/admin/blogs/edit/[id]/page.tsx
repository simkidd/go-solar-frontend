import UpdateBlogPostForm from "@/app/(dashboard)/components/UpdateBlogPostForm";
import { Post } from "@/interfaces/post.interface";
import { getPost } from "@/lib/data";
import Link from "next/link";

const EditBlogPage = async ({ params }: { params: { id: string } }) => {
  const post: Post = await getPost(params.id);

  return (
    <div className="w-full max-w-[860px] mx-auto py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Edit Post</h3>

        {/* <Link href={`/admin/blogs/${post?._id}`}>
          <button className="bg-primary text-white text-sm px-4 py-2">
            Cancel
          </button>
        </Link> */}
      </div>
      <div className="w-full bg-white dark:bg-[#222327] py-8 px-6 shadow rounded">
        <UpdateBlogPostForm post={post} />
      </div>
    </div>
  );
};

export default EditBlogPage;
