import { Post } from "@/interfaces/post.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const BLOG_KEYS = {
  all: ["blogs"] as const,
  lists: () => [...BLOG_KEYS.all, "list"] as const,
  detail: (id: string) => [...BLOG_KEYS.all, "detail", id] as const,
};

export const useBlogPostsQuery = () => {
  return useQuery<Post[]>({
    queryKey: BLOG_KEYS.lists(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/blogs");
      return data?.blogs || [];
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
