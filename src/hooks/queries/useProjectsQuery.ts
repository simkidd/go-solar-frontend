import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const PROJECT_KEYS = {
  all: ["projects"] as const,
  lists: () => [...PROJECT_KEYS.all, "list"] as const,
  detail: (id: string) => [...PROJECT_KEYS.all, "detail", id] as const,
};

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: PROJECT_KEYS.lists(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/projects");
      return data?.projects || [];
    },
  });
};
