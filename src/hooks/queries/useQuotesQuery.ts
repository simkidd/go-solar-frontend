import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const QUOTE_KEYS = {
  all: ["quotes"] as const,
  lists: () => [...QUOTE_KEYS.all, "list"] as const,
};

export const useQuotesQuery = () => {
  return useQuery({
    queryKey: QUOTE_KEYS.lists(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/quotes");
      return data?.quotes || [];
    },
  });
};
