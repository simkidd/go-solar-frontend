import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@/interfaces/order.interface";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  user: (userId?: string) =>
    [...ORDER_KEYS.all, "user", userId || "me"] as const,
  detail: (id: string) => [...ORDER_KEYS.all, "detail", id] as const,
};

export interface PaginatedOrdersResponse {
  orders: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Fetch all orders (admin) with pagination
export const useAllOrdersQuery = (params?: {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}) => {
  const { page = 1, limit = 10, q = "", status = "All" } = params || {};

  return useQuery<PaginatedOrdersResponse>({
    queryKey: [...ORDER_KEYS.lists(), page, limit, q, status],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/all-orders", {
        params: { page, limit, q, status },
      });
      return {
        orders: data?.orders || [],
        pagination: data?.pagination || { total: 0, page, limit, pages: 1 },
      };
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
  return useQuery<Order>({
    queryKey: ORDER_KEYS.detail(orderId || ""),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/orders/${orderId}`);
      return data?.order;
    },
    enabled: Boolean(orderId),
  });
};
