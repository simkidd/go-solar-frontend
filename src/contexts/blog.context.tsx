import { CreatePostInput } from "@/interfaces/post.interface";
import { axiosInstance } from "@/lib/axios";
import { createContext, useContext, useState } from "react";

interface IBlog {
  loading: boolean;
  createPost: (formData: FormData, config: any) => Promise<void>;
  updatePost: (formData: FormData) => Promise<void>;
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
        alert(data.message);
      }
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
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
        alert(data.message);
      }
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <BlogContext.Provider value={{ loading, createPost, updatePost }}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogProvider;
