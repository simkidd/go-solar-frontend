import { Category, PaginatedCategoriesResponse } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface CategoryTreeItem extends Category {
  parent?: { _id: string; name: string; slug: string } | null;
  subcategories?: Category[];
}

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  tree: () => [...CATEGORY_KEYS.all, "tree"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.all, "detail", id] as const,
};

// Fetch flat categories list
export const useCategoriesQuery = (params?: {
  page?: number;
  limit?: number;
  q?: string;
  parent?: string | null;
}) => {
  const { page = 1, limit = 10, q = "", parent } = params || {};
  const parentParam = parent === null ? "null" : parent;
  return useQuery<PaginatedCategoriesResponse>({
    queryKey: [...CATEGORY_KEYS.lists(), page, limit, q, parentParam],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/categories", {
        params: { page, limit, q, parent: parentParam },
      });
      return data;
    },
  });
};

// Fetch nested category tree (top-level + subcategories)
export const useCategoryTreeQuery = () => {
  return useQuery<CategoryTreeItem[]>({
    queryKey: CATEGORY_KEYS.tree(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/categories/tree");
      return data?.categories || [];
    },
  });
};

// Fetch single category by ID
export const useCategoryByIdQuery = (id?: string) => {
  return useQuery<Category>({
    queryKey: CATEGORY_KEYS.detail(id || ""),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/categories/${id}`);
      return data?.category;
    },
    enabled: Boolean(id),
  });
};
