import { UpdateProductInput } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PRODUCT_KEYS } from "../queries/useProductsQuery";

interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}

// Create Product Mutation
export const useCreateProductMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Product created successfully");
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create product";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

// Update Product Mutation
export const useUpdateProductMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProductInput) => {
      const { data } = await axiosInstance.put(
        `/products/${input.productId}`,
        input
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Product updated successfully");
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update product";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

// Delete Product Mutation
export const useDeleteProductMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await axiosInstance.delete(`/products/${productId}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete product";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

// Update Product Image Mutation
export const useUpdateProductImageMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.put("/products/update-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Product image updated successfully");
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update image";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};
