"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Post } from "@/interfaces/post.interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BlogCard from "./BlogCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PostsList: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [filteredPosts] = useState<Post[]>(posts);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState<number>(initialPage);

  const itemPerPage = 10;
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
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [pathname, router, searchParams]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [page, filteredPosts]);

  return (
    <div className="w-full lg:pr-6 space-y-6">
      {paginatedPosts?.length === 0 ? (
        <div className="flex items-center justify-center h-[50vh]">
          <h2 className="font-extrabold text-xl text-zinc-400">No posts found</h2>
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="gap-1 rounded-xl text-zinc-700 dark:text-zinc-300"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-xs font-semibold text-zinc-500 px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="gap-1 rounded-xl text-zinc-700 dark:text-zinc-300"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostsList;
