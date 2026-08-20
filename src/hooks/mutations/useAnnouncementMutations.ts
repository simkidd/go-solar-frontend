import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ANNOUNCEMENT_KEYS } from "../queries/useAnnouncementQuery";

interface UpdateAnnouncementInput {
  text: string;
  isActive: boolean;
  link?: string;
}

export const useUpdateAnnouncementMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateAnnouncementInput) => {
      const { data } = await axiosInstance.put("/announcements", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Announcement updated successfully!");
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.all });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update announcement";
      toast.error(message);
    },
  });
};
