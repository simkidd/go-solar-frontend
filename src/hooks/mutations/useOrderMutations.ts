import { CreateOrderInput } from "@/interfaces/product.interface";
import { UpdateTrackingStatus } from "@/interfaces/order.interface";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ORDER_KEYS } from "../queries/useOrdersQuery";

export const useCreateOrderMutation = (options?: { onSuccess?: (data: any) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const { data } = await axiosInstance.post("/orders", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create order";
      toast.error(message);
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTrackingStatus | { trackingLevel: number; trackingId?: string }) => {
      const { data } = await axiosInstance.put("/orders/update-tracking-level", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Tracking status updated!");
      if (data?.order?._id) {
        queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(data.order._id) });
      }
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update tracking status";
      toast.error(message);
    },
  });
};
