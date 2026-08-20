import { UpdatePostInput } from "@/interfaces/post.interface";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BLOG_KEYS } from "../queries/useBlogQuery";

interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}

export const useCreateBlogPostMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Blog post created successfully!");
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create blog post";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useUpdateBlogPostMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: FormData) => {
      const id = payload.get("id");
      const { data } = await axiosInstance.put(`/blogs/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Blog post updated successfully!");
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update blog post";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useDeleteBlogPostMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await axiosInstance.delete(`/blogs/${postId}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Blog post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: BLOG_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete blog post";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};
