import { BlogCardList } from "@/components/BlogCard";
import PageHeader from "@/components/PageHeader";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/data";
import { CalendarCheck } from "lucide-react";
import Image from "next/image";

export const generateStaticParams = async () => {
  try {
    const res = await fetch(`https://dummyjson.com/posts`);

    const data = await res.json();
    const posts = data.posts;

    return posts.map((post: Post) => ({
      id: post.id?.toString(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (id: number) => {
  try {
    const res = await fetch(`https://dummyjson.com/posts/` + id);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

const SingleBlogPage = async ({ params }: { params: { id: string } }) => {
  const post: Post = await getPost(+params.id);
  const posts: Post[] = await getPosts();

  return (
    <div className="w-full">
      <PageHeader name={post?.title} />
      <div className="container mx-auto px-2 py-16">
        <div className="max-w-[1100px] mx-auto px-2">
          <div className="grid lg:grid-cols-3 grid-cols-1 ">
            <div className="lg:col-span-2 col-span-1 lg:px-4">
              <div className="flex items-center text-sm mb-4">
                <CalendarCheck size={18} />
                <span className="ml-2">March 2, 2024</span>
              </div>
              <div className="w-full lg:h-96 md:h-96 h-72 bg-gray-400 mb-8 overflow-hidden">
                <Image src="" alt="" className="w-full h-full object-cover" />
              </div>

              <article className="">{post?.body}</article>
            </div>
            <div className="col-span-1 lg:px-4 mt-8 lg:mt-0">
              <div>
                <h2 className="text-lg font-semibold mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
                  About Us
                </h2>
              </div>
              <div className="w-full">
                <h2 className="text-lg font-semibold mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
                  Recent Post
                </h2>

                <div className="w-full flex flex-col space-y-2">
                  {posts?.slice(0, 3).map((item) => (
                    <BlogCardList key={item?.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
