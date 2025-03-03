import { BlogCardList } from "@/components/BlogCard";
import PageHeader from "@/components/PageHeader";
import SocialShare from "@/components/SocialShare";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/api/posts";
import { formatDate } from "@/utils/helpers";
import { CalendarCheck } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

interface IPost {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: IPost): Promise<Metadata> => {
  const { slug } = await params;
  const posts: Post[] = await getPosts();
  const post = posts.find((post) => post?.slug === slug);

  return {
    title: post?.title,
    description: post?.content,
    alternates: {
      canonical: `/blog/${post?.slug}`,
    },
    openGraph: {
      title: post?.title,
      description: post?.content,
      images: [post?.image || ""],
    },
  };
};

export const generateStaticParams = async () => {
  try {
    const posts = await getPosts();

    return posts.map((post: any) => ({
      // id: post?._id,
      slug: post?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const SingleBlogPage = async ({ params }: IPost) => {
  const { slug } = await params;
  const posts: Post[] = await getPosts();
  const post = posts.find((post) => post?.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full">
      <PageHeader
        heading={post?.title}
        className="bg-blog-bg bg-no-repeat bg-bottom bg-cover text-white"
      />
      <div className="container mx-auto px-2 py-16">
        <div className="max-w-[1100px] mx-auto px-2">
          <div className="grid lg:grid-cols-3 grid-cols-1 ">
            <div className="lg:col-span-2 col-span-1 lg:px-4">
              <div className="flex items-center text-sm mb-4">
                <CalendarCheck size={18} />
                <span className="ml-2">{formatDate(post?.createdAt)}</span>
              </div>
              <div className="w-full lg:h-96 md:h-96 h-72 bg-gray-400 mb-8 overflow-hidden">
                <Image
                  src={post?.image}
                  alt={post?.title}
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
              </div>

              <article className="">{post?.content}</article>
            </div>
            <div className="col-span-1 lg:px-4 mt-8 lg:mt-0">
              <div className="w-full mb-8">
                <h2 className="text-lg font-semibold mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
                  Recent Post
                </h2>

                <div className="w-full flex flex-col space-y-2">
                  {posts?.slice(0, 3).map((item) => (
                    <BlogCardList key={item?._id} item={item} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
                  Share
                </h2>
                <SocialShare />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
