import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Announcement {
  _id: string;
  text: string;
  isActive: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export const ANNOUNCEMENT_KEYS = {
  all: ["announcement"] as const,
};

export const useAnnouncementQuery = () => {
  return useQuery<{ success: boolean; announcement: Announcement }>({
    queryKey: ANNOUNCEMENT_KEYS.all,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/announcements");
      return data;
    },
  });
};
