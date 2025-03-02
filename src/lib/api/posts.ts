import { axiosInstance } from "../axios";

export const getPosts = async () => {
  const { data } = await axiosInstance.get("/blogs");
  return data?.blogs;
};

export const getPostById = async (id: string) => {
  const { data } = await axiosInstance.get(`/blogs/${id}`);
  return data.blog;
};
