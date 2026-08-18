import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const PACKAGE_KEYS = {
  all: ["packages"] as const,
  lists: (params?: Record<string, any>) => [...PACKAGE_KEYS.all, "list", params] as const,
  detail: (id: string) => [...PACKAGE_KEYS.all, "detail", id] as const,
};

export const usePackagesQuery = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: PACKAGE_KEYS.lists(params),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/packages", { params });
      return data?.packages || [];
    },
  });
};

export const usePackageByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: PACKAGE_KEYS.detail(id || ""),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/packages/${id}`);
      return data?.package;
    },
    enabled: Boolean(id),
  });
};
