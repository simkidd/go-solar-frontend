import DeletePost from "@/app/(dashboard)/components/DeletePost";
import UpdatePostButton from "@/app/(dashboard)/components/UpdatePostButton";
import { Post } from "@/interfaces/post.interface";
import { getPost, getPosts } from "@/lib/data";
import { ArrowLeft, CalendarCheck, Pen, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface IPost {
  params: { id: string };
}

export const generateMetadata = async ({
  params,
}: IPost): Promise<Metadata> => {
  const post: Post = await getPost(params.id);

  return {
    title: post?.title,
    description: post?.content,
  };
};

export const generateStaticParams = async () => {
  try {
    const posts = await getPosts();

    return posts.map((post: any) => ({
      id: post?._id,
    }));
  } catch (error) {
    console.log(error);
  }
};

const SinglePostPage = async ({ params }: IPost) => {
  const post: Post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  console.log(post)

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

          <UpdatePostButton post={post} />
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
