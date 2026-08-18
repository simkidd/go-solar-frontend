import { Banner } from "@/interfaces/banner.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const BANNER_KEYS = {
  all: ["banners"] as const,
  lists: () => [...BANNER_KEYS.all, "list"] as const,
  active: () => [...BANNER_KEYS.all, "active"] as const,
  detail: (id: string) => [...BANNER_KEYS.all, "detail", id] as const,
};

// Fetch all active banners (customer storefront)
export const useActiveBannersQuery = () => {
  return useQuery<Banner[]>({
    queryKey: BANNER_KEYS.active(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/banners");
      return data?.banners || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch all banners including drafts (admin dashboard)
export const useAllBannersAdminQuery = () => {
  return useQuery<Banner[]>({
    queryKey: BANNER_KEYS.lists(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/banners/all");
      return data?.banners || [];
    },
  });
};
