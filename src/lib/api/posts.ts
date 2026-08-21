import { axiosInstance } from "../axios";
import { FALLBACK_POSTS } from "../data";

export const getPosts = async () => {
  try {
    const { data } = await axiosInstance.get("/blogs/published");
    if (data?.blogs && data.blogs.length > 0) {
      return data.blogs;
    }
    return FALLBACK_POSTS;
  } catch (error) {
    console.log(error);
    return FALLBACK_POSTS;
  }
};

export const getPostById = async (id: string) => {
  try {
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
      const { data } = await axiosInstance.get(`/blogs/${id}`);
      if (data?.blog) {
        return data.blog;
      }
    }
    return FALLBACK_POSTS.find((p) => p._id === id || p.slug === id);
  } catch (error) {
    console.log(error);
    return FALLBACK_POSTS.find((p) => p._id === id || p.slug === id);
  }
};
