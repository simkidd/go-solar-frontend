import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BANNER_KEYS } from "../queries/useBannersQuery";

interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}

export const useCreateBannerMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Banner created successfully!");
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create banner";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useUpdateBannerMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bannerId, formData }: { bannerId: string; formData: FormData }) => {
      const { data } = await axiosInstance.put(`/banners/${bannerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Banner updated successfully!");
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update banner";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useDeleteBannerMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bannerId: string) => {
      const { data } = await axiosInstance.delete(`/banners/${bannerId}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Banner deleted successfully!");
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete banner";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useToggleBannerStatusMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bannerId: string) => {
      const { data } = await axiosInstance.patch(`/banners/${bannerId}/status`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Banner status updated!");
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to toggle banner status";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};
