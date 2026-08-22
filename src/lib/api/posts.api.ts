import { axiosInstance } from "../axios";
import { Post } from "@/interfaces/post.interface";

export const getPosts = async (): Promise<Post[]> => {
  try {
    const { data } = await axiosInstance.get("/blogs/published");
    return data?.blogs || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
      const { data } = await axiosInstance.get(`/blogs/${id}`);
      return data?.blog || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
};

export const getPost = getPostById;
