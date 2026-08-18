import { Offer } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const OFFER_KEYS = {
  all: ["offers"] as const,
  lists: () => [...OFFER_KEYS.all, "list"] as const,
  active: () => [...OFFER_KEYS.all, "active"] as const,
  detail: (id: string) => [...OFFER_KEYS.all, "detail", id] as const,
};

// Fetch all promotional campaigns (admin)
export const useAllOffersQuery = () => {
  return useQuery<Offer[]>({
    queryKey: OFFER_KEYS.lists(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/offers/all");
      return data?.offers || [];
    },
  });
};

// Fetch active offers (public storefront)
export const useActiveOffersQuery = () => {
  return useQuery<Offer[]>({
    queryKey: OFFER_KEYS.active(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/offers");
      return data?.offers || [];
    },
  });
};
