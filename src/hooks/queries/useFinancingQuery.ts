import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const FINANCING_KEYS = {
  all: ["financing"] as const,
  lists: () => [...FINANCING_KEYS.all, "list"] as const,
  my: () => [...FINANCING_KEYS.all, "my"] as const,
  detail: (id: string) => [...FINANCING_KEYS.all, "detail", id] as const,
  admin: (page: number, status: string) =>
    [...FINANCING_KEYS.all, "admin", { page, status }] as const,
};

export const useMyFinancingRequestsQuery = () => {
  return useQuery({
    queryKey: FINANCING_KEYS.my(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/financing/my-requests");
      return data?.financingRequests || [];
    },
  });
};

export const useSingleFinancingQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: FINANCING_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/financing/${id}`);
      return data?.financing || null;
    },
    enabled: !!id && enabled,
  });
};

export const useAdminFinancingRequestsQuery = (page = 1, status = "") => {
  return useQuery({
    queryKey: FINANCING_KEYS.admin(page, status),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/financing/admin/all", {
        params: { page, status },
      });
      return data || { requests: [], pagination: {} };
    },
  });
};
