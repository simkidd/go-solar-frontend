import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUOTE_KEYS } from "../queries/useQuotesQuery";

export const useCreateQuoteMutation = (options?: { onSuccess?: (data: any) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await axiosInstance.post("/quotes", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Quote generated and sent!");
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
