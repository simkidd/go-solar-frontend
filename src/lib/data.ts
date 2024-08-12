import { Product } from "@/interfaces/product.interface";
import { axiosInstance } from "./axios";

const timestamp = new Date().getTime();

export const getPosts = async () => {
  try {
    const { data } = await axiosInstance.get(`/blogs?t=${timestamp}`);

    return data.blogs;
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/blogs/${id}`);

    return data.blog;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    const { data } = await axiosInstance.get(`/products?t=${timestamp}`);

    return data.products;
  } catch (error) {
    console.log(error);
  }
};
export const getPubilshedProducts = async () => {
  try {
    const { data } = await axiosInstance.get(`/products?t=${timestamp}`);

    const publishedProducts = data.products.filter(
      (product: Product) => product.isPublished
    );

    return publishedProducts;
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);

    return data.product;
  } catch (error) {
    console.log(error);
  }
};

export const getCategories = async () => {
  try {
    const { data } = await axiosInstance.get(`/categories?t=${timestamp}`);

    return data.categories;
  } catch (error) {
    console.log(error);
  }
};

export const getOrders = async () => {
  try {
    const { data } = await axiosInstance.get(
      `/admin/all-orders?t=${timestamp}`
    );

    return data.orders;
  } catch (error) {
    console.log(error);
  }
};

export const getOrder = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/users/orders/${id}`);

    return data.order;
  } catch (error) {
    console.log(error);
  }
};

export const getOffers = async () => {
  try {
    const { data } = await axiosInstance.get(`/offers?t=${timestamp}`);

    return data.offers;
  } catch (error) {
    console.error(error);
  }
};
export const getOffer = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/offers/${id}`);

    return data.offer;
  } catch (error) {
    console.error(error);
  }
};

export const getUserOrders = async () => {
  try {
    const { data } = await axiosInstance.get(
      `/users/orders/user-orders?t=${timestamp}`
    );

    return data.orders;
  } catch (error) {
    console.log(error);
  }
};
