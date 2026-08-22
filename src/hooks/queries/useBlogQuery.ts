import { Post } from "@/interfaces/post.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const BLOG_KEYS = {
  all: ["blogs"] as const,
  lists: () => [...BLOG_KEYS.all, "list"] as const,
  detail: (id: string) => [...BLOG_KEYS.all, "detail", id] as const,
};

export const useBlogPostsQuery = (params?: { page?: number; limit?: number; q?: string }) => {
  return useQuery<{ blogs: Post[]; totalPages: number; currentPage: number; totalBlogs: number }>({
    queryKey: [...BLOG_KEYS.lists(), params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/blogs", { params });
      return {
        blogs: data?.blogs || [],
        totalPages: data?.totalPages || 1,
        currentPage: data?.currentPage || 1,
        totalBlogs: data?.totalBlogs || 0,
      };
    },
  });
};

export const useBlogPostByIdQuery = (id?: string) => {
  return useQuery<Post>({
    queryKey: BLOG_KEYS.detail(id || ""),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/blogs/${id}`);
      return data?.blog;
    },
    enabled: Boolean(id),
  });
};
