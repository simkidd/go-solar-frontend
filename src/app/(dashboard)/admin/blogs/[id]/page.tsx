import DeletePost from "@/app/(dashboard)/components/DeletePost";
import { Post } from "@/interfaces/post.interface";
import { getPost } from "@/lib/data";
import { ArrowLeft, CalendarCheck, Pen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// export const generateStaticParams = async () => {
//   try {
//     const posts: Post[] = await getPosts();

//     return posts.map((post) => ({
//       id: post._id,
//     }));
//   } catch (error) {
//     console.log(error);
//   }
// };

const SinglePostPage = async ({ params }: { params: { id: string } }) => {
  const post: Post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/blogs">
          <button className="px-4 py-2 text-sm flex items-center">
            <ArrowLeft className="mr-2" size={16} />
            Go back
          </button>
        </Link>
        <div className="flex items-center gap-2">
          <DeletePost post={post} />

          <Link href={`/admin/blogs/${post._id}/edit`}>
            <button className="bg-primary text-white px-4 py-2 text-sm flex items-center">
              <Pen className="mr-2" size={16} />
              Edit
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] py-16 px-6 shadow rounded">
        <div className="w-full max-w-[860px] mx-auto flex flex-col items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm mb-4">
              <CalendarCheck size={18} />
              <span className="ml-1">March 2, 2024</span>
            </div>
            <div className="flex items-center text-sm mb-4 before:content-['•']">
              <User size={18} className="ml-2" />
              <span className="ml-1">{post?.author}</span>
            </div>
          </div>
          <h1 className="font-bold lg:text-4xl text-3xl text-center leading-relaxed">
            {post?.title}
          </h1>
        </div>
        <div className="w-full max-w-[860px] mx-auto lg:h-96 md:h-96 h-72 bg-gray-400 mb-8 overflow-hidden">
          <Image
            src={post?.image}
            alt={post?.title}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </div>
        <article className="w-full max-w-[750px] mx-auto text-justify">
          {post?.content}
        </article>
      </div>
    </div>
  );
};

export default SinglePostPage;
