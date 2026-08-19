import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PROJECT_KEYS } from "../queries/useProjectsQuery";

export const useCreateProjectMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Project created successfully!");
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create project";
      toast.error(message);
    },
  });
};

export const useUpdateProjectMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { data } = await axiosInstance.put(`/projects/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update project";
      toast.error(message);
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/projects/${id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: PROJECT_KEYS.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete project";
      toast.error(message);
    },
  });
};
