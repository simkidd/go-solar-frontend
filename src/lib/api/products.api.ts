import {
  Product,
  UpdateProductInput,
  Category
} from "@/interfaces/product.interface";
import { axiosInstance } from "../axios";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await axiosInstance.get("/products", {
      params: { limit: 1000 },
    });
    return data?.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data?.product || null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const getProduct = getProductById;

export const getProductsByCategory = async (categoryId: string, page = 1, limit = 10) => {
  try {
    const { data } = await axiosInstance.get(`/products/category/${categoryId}?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error(`Error fetching products by category ${categoryId}:`, error);
    return null;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await axiosInstance.get("/categories", {
      params: { page: 1, limit: 1000 }
    });
    return data?.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getPubilshedProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await axiosInstance.get("/products/published", {
      params: { limit: 1000 },
    });
    return data?.products || [];
  } catch (error) {
    console.error("Error fetching published products:", error);
    return [];
  }
};

export const deleteProduct = async (id: string) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};

export const updateProduct = async (input: UpdateProductInput) => {
  const { data } = await axiosInstance.patch(
    "/admin/update-product-details",
    input
  );
  return data;
};

export const createProduct = async (
  formData: FormData,
  config: any
): Promise<Product> => {
  const { data } = await axiosInstance.post(
    "/admin/add-product",
    formData,
    config
  );
  return data;
};
