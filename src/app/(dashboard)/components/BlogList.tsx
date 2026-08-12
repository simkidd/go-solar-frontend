"use client";
import React, { useMemo, useState } from "react";
import { BlogCardAdmin } from "@/components/BlogCard";
import { useBlogPostsQuery } from "@/hooks/queries/useBlogQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const BlogList = () => {
  const { data: posts = [], isLoading: loading, refetch } = useBlogPostsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [page, setPage] = useState(1);

  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const filteredPosts = useMemo(() => {
    let selectedPosts = [...posts];

    if (searchTerm) {
      selectedPosts = selectedPosts.filter(
        (post) =>
          post?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post?.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return selectedPosts;
  }, [posts, searchTerm]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [page, filteredPosts]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
      setSearchTerm(value);
    } else {
      params.delete("q");
      setSearchTerm("");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-[#222327]/40 border-zinc-200 dark:border-zinc-800"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="dark:bg-[#222327] border-zinc-100 dark:border-zinc-800">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : paginatedPosts?.length === 0 ? (
        <Card className="dark:bg-[#222327] border-zinc-100 dark:border-zinc-800">
          <CardContent className="p-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No posts found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts?.map((post) => (
              <BlogCardAdmin key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="border-zinc-200 dark:border-zinc-800"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="border-zinc-200 dark:border-zinc-800"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;
