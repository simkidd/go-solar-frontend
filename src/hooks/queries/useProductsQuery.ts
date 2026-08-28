import {
  Product,
  PaginatedProductsResponse,
} from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  published: () => [...PRODUCT_KEYS.all, "published"] as const,
  detail: (idOrSlug: string) =>
    [...PRODUCT_KEYS.all, "detail", idOrSlug] as const,
  category: (categoryId: string) =>
    [...PRODUCT_KEYS.all, "category", categoryId] as const,
};

// Fetch all products (admin / unfiltered)
export const useAllProductsQuery = (params?: {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  category?: string;
}) => {
  return useQuery<PaginatedProductsResponse>({
    queryKey: [...PRODUCT_KEYS.lists(), params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/products", {
        params,
      });
      return data;
    },
  });
};

// Fetch published products (public storefront)
export const usePublishedProductsQuery = (params?: {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string;
  offer?: string;
}) => {
  return useQuery<PaginatedProductsResponse>({
    queryKey: [...PRODUCT_KEYS.published(), params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/products/published", {
        params,
      });
      return data;
    },
  });
};

// Fetch single product by ID
export const useProductByIdQuery = (id?: string) => {
  return useQuery<Product>({
    queryKey: PRODUCT_KEYS.detail(id || ""),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/products/${id}`);
      return data?.product;
    },
    enabled: Boolean(id),
  });
};

// Fetch products by category
export const useCategoryProductsQuery = (params?: {
  categoryId?: string;
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}) => {
  return useQuery<{
    products: Product[];
    pagination: { total: number; page: number; limit: number; pages: number };
  }>({
    queryKey: [...PRODUCT_KEYS.category(params?.categoryId || ""), params],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/products/category/${params?.categoryId}`,
        {
          params,
        },
      );
      return data;
    },
    enabled: Boolean(params?.categoryId),
  });
};
