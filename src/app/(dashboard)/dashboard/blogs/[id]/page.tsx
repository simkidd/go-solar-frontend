import SingleBlogComp from "@/app/(dashboard)/components/SingleBlogComp";
import { Post } from "@/interfaces/post.interface";
import { getPost, getPosts } from "@/lib/data";
import { Metadata } from "next";

interface IPost {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: IPost): Promise<Metadata> => {
  const { id } = await params;
  const post: Post = await getPost(id);

  return {
    title: post?.title ? `${post.title} | Admin View` : "Blog Details",
    description: post?.excerpt || post?.title,
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
  const { id } = await params;

  return (
    <div className="w-full font-inter max-w-6xl mx-auto py-4">
      <SingleBlogComp id={id} />
    </div>
  );
};

export default SinglePostPage;
