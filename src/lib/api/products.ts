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

export const getCategories = async () => {
  const { data } = await axiosInstance.get("/categories");
  return data.categories;
};

export const getPubilshedProducts = async () => {
  const { data } = await axiosInstance.get("/products");

  const publishedProducts = data.products.filter(
    (product: Product) => product.isPublished
  );
  return publishedProducts;
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
