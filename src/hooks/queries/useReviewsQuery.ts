import { IReview } from "@/interfaces/review.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  lists: () => [...REVIEW_KEYS.all, "list"] as const,
  admin: () => [...REVIEW_KEYS.all, "admin"] as const,
};

// Fetch published reviews for storefront
export const useReviewsQuery = () => {
  return useQuery<IReview[]>({
    queryKey: REVIEW_KEYS.lists(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reviews");
      return data?.reviews || [];
    },
  });
};

// Fetch all reviews for admin dashboard
export const useAllReviewsQuery = () => {
  return useQuery({
    queryKey: REVIEW_KEYS.admin(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reviews/all");
      return data?.reviews || [];
    },
  });
};
