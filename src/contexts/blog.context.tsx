"use client"
import { axiosInstance } from "@/lib/axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

interface IBlog {
  loading: boolean;
  createPost: (formData: FormData, config: any) => Promise<void>;
  updatePost: (formData: FormData) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

export const BlogContext = createContext<IBlog>({} as IBlog);

export const useBlog = () => useContext(BlogContext);

const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const createPost = async (formData: FormData, config: any) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/admin/add-blog",
        formData,
        config
      );

      if (data) {
        toast.success(data.message);
      }
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (formData: FormData) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        "/admin/update-blog",
        formData
      );

      if (data) {
        toast.success(data.message);
      }
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.delete(`/blogs/${id}`);

      if (data) {
        toast.success(data.message);
      }
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <BlogContext.Provider
      value={{ loading, createPost, updatePost, deletePost }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;
