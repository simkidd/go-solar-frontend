import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { REVIEW_KEYS } from "../queries/useReviewsQuery";

export const useCreateReviewMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await axiosInstance.post("/reviews", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Review submitted for approval!");
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to submit review";
      toast.error(message);
    },
  });
};

export const useToggleReviewPublishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.put(`/reviews/${id}/toggle-publish`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Review status updated");
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update review";
      toast.error(message);
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/reviews/${id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Review deleted");
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete review";
      toast.error(message);
    },
  });
};
