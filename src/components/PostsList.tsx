"use client";
import { Post } from "@/interfaces/post.interface";
import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import BlogCard from "./BlogCard";

const PostsList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState<number>(initialPage);

  const itemPerPage = 2;

  const totalPages = Math.ceil(filteredPosts.length / itemPerPage);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const query = {
        ...Object.fromEntries(searchParams.entries()),
        page: String(newPage),
      };
      const url = `${pathname}?${new URLSearchParams(query).toString()}`;
      router.push(url);
      scrollTo(0, 0);
    },
    [pathname, router, searchParams]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [page, filteredPosts]);

  return (
    <div className="w-full lg:pr-6">
      {paginatedPosts?.length === 0 ? (
        <div className="flex items-center justify-center h-[50vh]">
          <h2 className="font-bold text-2xl">No post found</h2>
        </div>
      ) : (
        <>
          <div
            className={`grid md:grid-cols-2 grid-cols-1 gap-6 py-4 ${
              pathname === "/blog" ? "lg:grid-cols-2" : "lg:grid-cols-3"
            }`}
          >
            {paginatedPosts?.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {totalPages > 1 && (
              <Pagination
                showControls
                total={totalPages}
                page={page}
                onChange={handlePageChange}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostsList;
