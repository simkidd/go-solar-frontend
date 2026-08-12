import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PACKAGE_KEYS } from "../queries/usePackagesQuery";

export const useCreatePackageMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/packages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Package created successfully!");
      queryClient.invalidateQueries({ queryKey: PACKAGE_KEYS.all });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create package";
      toast.error(message);
    },
  });
};

export const useUpdatePackageMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: any }) => {
      const { data } = await axiosInstance.put(`/packages/${id}`, input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Package updated successfully!");
      queryClient.invalidateQueries({ queryKey: PACKAGE_KEYS.all });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update package";
      toast.error(message);
    },
  });
};

export const useDeletePackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/packages/${id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Package deleted successfully");
      queryClient.invalidateQueries({ queryKey: PACKAGE_KEYS.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete package";
      toast.error(message);
    },
  });
};
