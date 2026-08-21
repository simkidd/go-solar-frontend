"use client";

import React, { useState } from "react";
import { useBlogPostsQuery } from "@/hooks/queries/useBlogQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppModal from "@/components/AppModal";
import UpdateBlogPostForm from "./UpdateBlogPostForm";
import { DeletePopup } from "./DeletePost";
import {
  RefreshCw,
  Search,
  FileText,
  Eye,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CreatePostButton from "./CreatePostButton";
import { formatDate } from "@/utils/helpers";
import { Post } from "@/interfaces/post.interface";
import Image from "next/image";
import Link from "next/link";

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const postsPerPage = 8;

  const {
    data,
    isLoading: loading,
    refetch,
  } = useBlogPostsQuery({
    page,
    limit: postsPerPage,
    q: searchTerm,
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const paginatedPosts = data?.blogs || [];
  const totalPages = data?.totalPages || 1;

  // Selected post states for modals
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
      setSearchTerm(value);
    } else {
      params.delete("q");
      setSearchTerm("");
    }
    setPage(1); // Reset page to 1 on search
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 select-none">
            <FileText className="h-5 w-5 text-primary" />
            Blog Editorial Manager
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 select-none">
            Create, moderate, and publish verified client educational articles
            and announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-9 rounded-lg text-xs cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <CreatePostButton />
        </div>
      </div>

      {/* Search Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search posts by title or content..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-[#1a1b1e]/40 border-zinc-200 dark:border-zinc-800 h-10 text-xs rounded-xl focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Editorial Table Card Container */}
      <Card className="bg-card text-card-foreground border border-border/85 shadow-xs rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 select-none">
              <TableRow className="border-b border-border/60">
                <TableHead className="w-[100px] text-xs font-black uppercase tracking-wider text-muted-foreground/80 py-4 pl-6">
                  Cover
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 py-4">
                  Title & Excerpt
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 py-4">
                  Author
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 py-4">
                  Category
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 py-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 py-4">
                  Date Published
                </TableHead>
                <TableHead className="text-xs font-black uppercase tracking-wider text-muted-foreground/80 py-4 text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="space-y-2 flex flex-col justify-center items-center py-6">
                      <Skeleton className="h-5 w-4/5 rounded" />
                      <Skeleton className="h-5 w-3/5 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-xs text-muted-foreground font-semibold py-8"
                  >
                    No editorial articles found in database index.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPosts.map((post) => (
                  <TableRow
                    key={post?._id}
                    className="border-b border-border/60 hover:bg-muted/15 transition-colors"
                  >
                    {/* Cover Thumbnail */}
                    <TableCell className="py-3 pl-6">
                      <div className="relative aspect-video w-14 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
                        {post?.image && (
                          <Image
                            src={post.image}
                            alt="thumbnail"
                            className="object-cover"
                            fill
                            sizes="60px"
                          />
                        )}
                      </div>
                    </TableCell>

                    {/* Title & Sub-excerpt */}
                    <TableCell className="py-3 max-w-[280px]">
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href={`/dashboard/blogs/${post?._id}`}
                          className="font-extrabold text-xs text-zinc-900 dark:text-white hover:text-primary transition-colors line-clamp-1"
                        >
                          {post?.title}
                        </Link>
                        {post?.excerpt && (
                          <span className="text-[10px] text-muted-foreground line-clamp-1">
                            {post.excerpt.replace(/<[^>]*>/g, "")}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Author */}
                    <TableCell className="py-3 text-xs font-semibold text-zinc-650 dark:text-zinc-400">
                      {post?.author || "Staff Admin"}
                    </TableCell>

                    {/* Category Tags */}
                    <TableCell className="py-3">
                      {post?.tags?.[0] ? (
                        <span className="bg-primary/10 text-primary border border-primary/20 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider select-none">
                          {post.tags[0]}
                        </span>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </TableCell>

                    {/* Publish status */}
                    <TableCell className="py-3">
                      {post?.isPublished ? (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider select-none">
                          Published
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider select-none">
                          Draft
                        </span>
                      )}
                    </TableCell>

                    {/* Creation Date */}
                    <TableCell className="py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 select-none">
                      {formatDate(post?.createdAt)}
                    </TableCell>

                    {/* Dropdown Actions */}
                    <TableCell className="py-3 pr-6 text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 rounded-xl bg-card border border-border/80"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/blogs/${post?._id}`)
                              }
                              className="cursor-pointer text-xs font-bold"
                            >
                              <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPost(post);
                                setIsUpdateOpen(true);
                              }}
                              className="cursor-pointer text-xs font-bold"
                            >
                              <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>Update</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPost(post);
                                setIsDeleteOpen(true);
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50/50 dark:focus:bg-red-950/10 text-xs font-bold"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination control footer row */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 select-none font-semibold">
            Showing Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="border-zinc-200 dark:border-zinc-800 text-xs rounded-lg h-9 cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="border-zinc-200 dark:border-zinc-800 text-xs rounded-lg h-9 cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Update Post Modal */}
      {selectedPost && (
        <AppModal
          isOpen={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          title="Update Post"
          isDismissable={false}
          hideCloseButton
          size="2xl"
          scrollBehavior="inside"
        >
          <UpdateBlogPostForm
            onClose={() => setIsUpdateOpen(false)}
            post={selectedPost}
          />
        </AppModal>
      )}

      {/* Delete Confirmation Modal */}
      {selectedPost && (
        <AppModal
          isOpen={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="Confirmation"
          isDismissable={false}
          hideCloseButton
        >
          <DeletePopup
            onClose={() => setIsDeleteOpen(false)}
            post={selectedPost}
          />
        </AppModal>
      )}
    </div>
  );
};

export default BlogList;
