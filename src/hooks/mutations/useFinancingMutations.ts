import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FINANCING_KEYS } from "../queries/useFinancingQuery";

export const useCreateFinancingRequest = (options?: {
  onSuccess?: (data: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: any) => {
      const { data } = await axiosInstance.post("/financing/request", input);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: FINANCING_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to submit financing request";
      toast.error(message);
    },
  });
};

export const usePayFinancingStep = (options?: {
  onSuccess?: (data: any) => void;
}) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.post(`/financing/${id}/pay`);
      return data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to initialize payment";
      toast.error(message);
    },
  });
};

export const useVerifyFinancingPayment = (options?: {
  onSuccess?: (data: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reference: string) => {
      const { data } = await axiosInstance.post("/financing/verify-payment", {
        reference,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Payment verified successfully!");
      queryClient.invalidateQueries({ queryKey: FINANCING_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to verify payment";
      toast.error(message);
    },
  });
};

export const useAdminApproveFinancing = (options?: {
  onSuccess?: (data: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      adminNotes,
      monthlyPayment,
      downPayment,
    }: {
      id: string;
      adminNotes?: string;
      monthlyPayment?: number;
      downPayment?: number;
    }) => {
      const { data } = await axiosInstance.put(`/financing/admin/${id}/approve`, {
        adminNotes,
        monthlyPayment,
        downPayment,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Financing request approved!");
      queryClient.invalidateQueries({ queryKey: FINANCING_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to approve financing request";
      toast.error(message);
    },
  });
};

export const useAdminDeclineFinancing = (options?: {
  onSuccess?: (data: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      adminNotes,
    }: {
      id: string;
      adminNotes?: string;
    }) => {
      const { data } = await axiosInstance.put(`/financing/admin/${id}/decline`, {
        adminNotes,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.error("Financing request declined");
      queryClient.invalidateQueries({ queryKey: FINANCING_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to decline financing request";
      toast.error(message);
    },
  });
};
