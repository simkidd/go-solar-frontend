import { Product } from "@/interfaces/product.interface";
import { axiosInstance } from "../axios";

export const getProducts = async () => {
  const { data } = await axiosInstance.get("/products");
  return data.products;
};

export const getProduct = async (id: string) => {
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
