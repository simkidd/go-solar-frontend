"use client";
import { BlogCardAdmin } from "@/components/BlogCard";
import { useBlogStore } from "@/lib/stores/blog.store";
import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { RefreshCcw, SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";

const BlogList = () => {
  const { posts, loading, fetchPosts } = useBlogStore();
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

  const onClear = useCallback(() => {
    setSearchTerm("");
    setPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
    scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex justify-end mb-4">
        <Button
          variant="solid"
          color="warning"
          onPress={fetchPosts}
          startContent={<RefreshCcw size={16} />}
          size="sm"
        >
          Refresh
        </Button>
      </div>

      <div className="flex justify-between gap-3 items-end lg:flex-row flex-col mb-4">
        <Input
          isClearable
          className="w-full lg:max-w-[44%]"
          classNames={{
            input: ["bg-transparent"],
            innerWrapper: "bg-transparent ",
            inputWrapper: [
              "border-1",
              "bg-white",
              "dark:bg-[#222327]",
              "hover:bg-default-200/70",
              "focus-within:!bg-default-200/50",
              "dark:hover:bg-default/70",
              "dark:focus-within:!bg-default/60",
            ],
          }}
          variant="bordered"
          placeholder="Search..."
          startContent={<SearchIcon />}
          value={searchTerm}
          onClear={() => onClear()}
          onValueChange={handleSearch}
          defaultValue={searchParams.get("q")?.toString()}
        />
      </div>

      {loading ? (
        <div className="py-4 flex justify-center">
          <Card className="dark:bg-[#222327]">
            <CardBody className="p-6">
              <Spinner size="lg" />
            </CardBody>
          </Card>
        </div>
      ) : paginatedPosts?.length === 0 ? (
        <Card className="dark:bg-[#222327]">
          <CardBody className="p-6">
            <p className="text-center">No post found</p>
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          <Card className="dark:bg-[#222327]">
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
                {paginatedPosts?.map((post) => (
                  <BlogCardAdmin key={post._id} post={post} />
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-end">
            <Pagination
              isCompact
              showControls
              showShadow
              initialPage={1}
              total={totalPages}
              page={page}
              onChange={handlePageChange}
              classNames={{
                wrapper: "bg-white dark:bg-[#222327]",
                item: "bg-transparent dark:text-white",
                prev: "bg-white dark:bg-[#222327]",
                next: "bg-white dark:bg-[#222327]",
                cursor: "",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
