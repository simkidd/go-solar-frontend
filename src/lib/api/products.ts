import {
  Product,
  UpdateProductInput
} from "@/interfaces/product.interface";
import { axiosInstance } from "../axios";

export const getProducts = async () => {
  const { data } = await axiosInstance.get("/products");
  return data.products;
};

export const getProductById = async (id: string) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data.product;
};

export const getProductsByCategory = async (categoryId: string, page = 1, limit = 10) => {
  const { data } = await axiosInstance.get(`/products/category/${categoryId}?page=${page}&limit=${limit}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await axiosInstance.get("/categories", {
    params: { page: 1, limit: 1000 }
  });
  return data.categories;
};

export const getPubilshedProducts = async () => {
  const { data } = await axiosInstance.get("/products/published");
  return data.products;
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
