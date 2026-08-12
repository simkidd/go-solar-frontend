import { Product } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  published: () => [...PRODUCT_KEYS.all, "published"] as const,
  detail: (idOrSlug: string) => [...PRODUCT_KEYS.all, "detail", idOrSlug] as const,
  category: (categoryId: string) => [...PRODUCT_KEYS.all, "category", categoryId] as const,
};

// Fetch all products (admin / unfiltered)
export const useAllProductsQuery = () => {
  return useQuery<Product[]>({
    queryKey: PRODUCT_KEYS.lists(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/products");
      return data?.products || [];
    },
  });
};

// Fetch published products (public storefront)
export const usePublishedProductsQuery = () => {
  return useQuery<Product[]>({
    queryKey: PRODUCT_KEYS.published(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/products/published");
      return data?.products || [];
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
export const useCategoryProductsQuery = (categoryId?: string) => {
  return useQuery<Product[]>({
    queryKey: PRODUCT_KEYS.category(categoryId || ""),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/products/category/${categoryId}`);
      return data?.products || [];
    },
    enabled: Boolean(categoryId),
  });
};
