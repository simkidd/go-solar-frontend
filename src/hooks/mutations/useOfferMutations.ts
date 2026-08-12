import { AddOfferProductDTO, CreateOfferInput, UpdateOfferInput } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OFFER_KEYS } from "../queries/useOffersQuery";
import { PRODUCT_KEYS } from "../queries/useProductsQuery";

interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}

export const useCreateOfferMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOfferInput) => {
      const { data } = await axiosInstance.post("/offers", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Offer created successfully!");
      queryClient.invalidateQueries({ queryKey: OFFER_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create offer";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useUpdateOfferMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ offerId, input }: { offerId: string; input: UpdateOfferInput }) => {
      const { data } = await axiosInstance.put(`/offers/${offerId}`, input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Offer updated successfully!");
      queryClient.invalidateQueries({ queryKey: OFFER_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update offer";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useDeleteOfferMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      const { data } = await axiosInstance.delete(`/offers/${offerId}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Offer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: OFFER_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete offer";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

export const useAddProductsToOfferMutation = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddOfferProductDTO) => {
      const { data } = await axiosInstance.post("/offers/add-products", input);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Products added to offer successfully!");
      queryClient.invalidateQueries({ queryKey: OFFER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to add products to offer";
      toast.error(message);
      options?.onError?.(error);
    },
  });
};
