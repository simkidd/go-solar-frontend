import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SETTINGS_KEYS } from "../queries/useSettingsQuery";

export const useUpdateSettingsMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await axiosInstance.put("/settings", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update settings";
      toast.error(message);
    },
  });
};
