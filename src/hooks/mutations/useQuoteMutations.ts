import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUOTE_KEYS } from "../queries/useQuotesQuery";

export const useCreateQuoteMutation = (options?: { 
  onSuccess?: (data: any) => void;
  showToast?: boolean;
}) => {
  const queryClient = useQueryClient();
  const showToast = options?.showToast ?? true;

  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await axiosInstance.post("/quotes", input);
      return data;
    },
    onSuccess: (data) => {
      if (showToast) {
        toast.success("Quote generated and sent!");
      }
      queryClient.invalidateQueries({ queryKey: QUOTE_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to submit quote";
      toast.error(message);
    },
  });
};

export const useUpdateQuoteStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await axiosInstance.put(`/quotes/${id}`, { status });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Quote updated");
      queryClient.invalidateQueries({ queryKey: QUOTE_KEYS.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update quote";
      toast.error(message);
    },
  });
};

export const useDeleteQuoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/quotes/${id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Quote lead deleted");
      queryClient.invalidateQueries({ queryKey: QUOTE_KEYS.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete quote";
      toast.error(message);
    },
  });
};
