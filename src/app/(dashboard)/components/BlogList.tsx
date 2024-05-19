"use client";
import BlogCard, { BlogCardAdmin } from "@/components/BlogCard";
import { axiosInstance } from "@/lib/axios";
import { useBlogStore } from "@/lib/stores/blog.store";
import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const BlogList = () => {
  const { posts, setPosts } = useBlogStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const postsPerPage = 3;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/blogs");
        setPosts(data.blogs);
        setTotalPages(Math.ceil(data.blogs.length / postsPerPage));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        {paginatedPosts?.length === 0 ? (
          <div className="col-span-4">
            <p>No post found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
              <Suspense fallback={<div>Loading posts...</div>}>
                {paginatedPosts?.map((post) => (
                  <BlogCardAdmin key={post._id} post={post} />
                ))}
              </Suspense>
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
