import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  user: (userId?: string) => [...ORDER_KEYS.all, "user", userId || "me"] as const,
  detail: (id: string) => [...ORDER_KEYS.all, "detail", id] as const,
};

// Fetch all orders (admin)
export const useAllOrdersQuery = () => {
  return useQuery({
    queryKey: ORDER_KEYS.lists(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/all-orders");
      return data?.orders || [];
    },
  });
};

// Fetch current user orders
export const useUserOrdersQuery = () => {
  return useQuery({
    queryKey: ORDER_KEYS.user(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/orders/user");
      return data?.orders || [];
    },
  });
};

// Fetch single order details
export const useOrderByIdQuery = (orderId?: string) => {
  return useQuery({
    queryKey: ORDER_KEYS.detail(orderId || ""),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/orders/${orderId}`);
      return data?.order;
    },
    enabled: Boolean(orderId),
  });
};
