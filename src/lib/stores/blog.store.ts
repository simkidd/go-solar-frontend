import { Post } from "@/interfaces/post.interface";
import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../axios";
import { revalidatePath } from "next/cache";

interface IBlog {
  loading: boolean;
  setLoading: (value: boolean) => void;
  post: Post | undefined;
  posts: Post[];
  setPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
  createPost: (formData: FormData, config: any) => Promise<void>;
  updatePost: (formData: FormData, config: any) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  fetchPosts: () => Promise<void>;
}

export const useBlogStore = create<IBlog>((set) => ({
  loading: false,
  post: undefined,
  posts: [],
  setLoading: (loading: boolean) => set({ loading }),
  setPost: (post: Post) => set({ post }),
  setPosts: (posts: Post[]) => set({ posts }),
  createPost: async (formData, config) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post(
        "/admin/add-blog",
        formData,
        config
      );

      set((state) => ({
        posts: [...state.posts, data.blog],
      }));
      toast.success(data.message);

      revalidatePath("/");
      revalidatePath("/blog");

      return data.blog;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  updatePost: async (formData, config) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.patch(
        "/admin/update-blog",
        formData,
        config
      );

      set((state) => ({
        post: { ...state.post, ...data.blog },
      }));

      toast.success(data.message);

      revalidatePath("/");
      revalidatePath("/blog");

      return data.blog;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  deletePost: async (id) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.delete(`/blogs/${id}`);

      set((state) => ({
        posts: state.posts.filter((post) => post?._id !== id),
      }));

      toast.success(data.message);

      revalidatePath("/");
      revalidatePath("/blog");

      return data;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  // for refetching
  fetchPosts: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/blogs");
      set({ posts: data.blogs });
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data?.message);
      console.log(errorMsg?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
}));
