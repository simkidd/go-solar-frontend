import PageHeader from "@/components/PageHeader";
import PostsList from "@/components/PostsList";
import Search from "@/components/Search";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const pageTitle = "Blogs Search";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const PostSearchResults = async ({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) => {
  const { q: query } = await searchParams;
  const posts: Post[] = await getPosts();

  let filteredResults: Post[] = [];

  if (query) {
    const searchWords = query?.toLowerCase().split(" ");

    filteredResults = posts?.filter((post) => {
      const productTitle = post?.title.toLowerCase();
      const productContent = post?.content.toLowerCase();
      const productTags = post?.tags.map((tag) => tag.toLowerCase()).join(" ");

      return searchWords.every(
        (word) =>
          productTitle.includes(word) ||
          productContent.includes(word) ||
          productTags.includes(word)
      );
    });

    if (!filteredResults) {
      notFound();
    }
  }

  return (
    <div className="w-full font-dmsans">
      <PageHeader
        heading={query ? `Search results for ${query}` : pageTitle}
        className="text-white bg-search-bg bg-no-repeat bg-center bg-cover grayscale"
      />

      <section className="w-full">
        <div className="container mx-auto px-2 pt-8">
          <div className="max-w-xl">
            <Search placeholder="Search a post..." />
          </div>
        </div>
        {query ? (
          <div className="container mx-auto px-2 py-8">
            <PostsList posts={filteredResults} />
          </div>
        ) : (
          <div className="container mx-auto px-2 py-8">
            <h2>Search for a post</h2>
          </div>
        )}
      </section>
    </div>
  );
};

export default PostSearchResults;
