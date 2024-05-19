"use client";
import { BlogCardAdmin } from "@/components/BlogCard";
import { useBlogStore } from "@/lib/stores/blog.store";
import { Pagination, Spinner } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

const BlogList = () => {
  const { posts, loading } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [page, setPage] = useState(1);

  const postsPerPage = 3;

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const filteredPosts = useMemo(() => {
    let selectedPosts = [...posts];

    if (searchTerm) {
      selectedPosts = selectedPosts.filter((post) =>
        post?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return selectedPosts;
  }, [posts, searchTerm]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [page, filteredPosts]);

  const handleSearch = useCallback(
    (value?: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
        setSearchTerm(value);
      } else {
        params.delete("q");
        setSearchTerm("");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
    scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="flex items-center py-4 px-4">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent border focus:outline-none px-2 py-1 w-full max-w-md text-sm rounded-md shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("q")?.toString()}
        />
      </div>
      <div className="py-4 px-4">
        {loading ? (
          <div className="py-4 flex justify-center">
            <Spinner />
          </div>
        ) : paginatedPosts?.length === 0 ? (
          <div className="col-span-4 text-center py-4">
            <p>No post found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
              {paginatedPosts?.map((post) => (
                <BlogCardAdmin key={post._id} post={post} />
              ))}
            </div>

            <div className="flex justify-center">
              <Pagination
                showControls
                total={totalPages}
                page={page}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
