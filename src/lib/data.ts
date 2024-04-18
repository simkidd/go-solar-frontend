import { axiosInstance } from "./axios";

export const API_URL = process.env.API_URL;

export const getPosts = async () => {
  try {
    const { data } = await axiosInstance.get("/blogs");

    return data.data.blogs;
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/blogs/${id}`);

    return data.data.blog;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    const { data } = await axiosInstance.get("/products");

    return data.data.products;
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);

    return data.data.product;
  } catch (error) {
    console.log(error);
  }
};

export const getCategories = async () => {
  try {
    const { data } = await axiosInstance.get("/categories");

    return data.data.categories;
  } catch (error) {
    console.log(error);
  }
};
