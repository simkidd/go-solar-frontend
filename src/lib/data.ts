import { axiosInstance } from "./axios";

export const API_URL = process.env.API_URL;

export const getPosts = async () => {
  try {
    const res = await axiosInstance.get("/posts");

    return res.data.posts;
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/posts/` + id);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    const res = await axiosInstance.get("/products");

    return res.data.products;
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/products/` + id);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCategories = async () => {
  try {
    const res = await axiosInstance.get("/categories");
    return res.data.categories;
  } catch (error) {
    console.log(error);
  }
};
