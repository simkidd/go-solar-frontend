import { CreateCategoryInput, UpdateCategoryInput } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CATEGORY_KEYS } from "../queries/useCategoriesQuery";

interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}

export const useCreateCategoryMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCategoryInput & { parent?: string | null }) => {
      const { data } = await axiosInstance.post("/categories", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Category created successfully!");
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create category";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useUpdateCategoryMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateCategoryInput & { parent?: string | null }) => {
      const { data } = await axiosInstance.put(`/categories/${input.categoryId}`, input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update category";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useDeleteCategoryMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const { data } = await axiosInstance.delete(`/categories/${categoryId}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete category";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};
