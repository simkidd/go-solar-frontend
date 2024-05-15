import {
  Category,
  CreateCategoryInput,
  Product,
  UpdateProductInput,
} from "@/interfaces/product.interface";
import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../axios";

interface IProductStore {
  loading: boolean;
  imageLoading: boolean;
  product: Product | undefined;
  products: Product[];
  setProduct: (product: Product) => void;
  setProducts: (products: Product[]) => void;
  createProduct: (formData: FormData, config: any) => Promise<void>;
  updateProduct: (input: UpdateProductInput) => Promise<void>;
  deleteProduct: (id: string) => void;
  updateImage: (formData: FormData, config: any) => Promise<void>;
  category: Category | undefined;
  categories: Category[];
  setCategory: (category: Category) => void;
  setCategories: (categories: Category[]) => void;
  createCategory: (input: CreateCategoryInput) => Promise<void>;
}

export const useProductStore = create<IProductStore>((set) => ({
  loading: false,
  imageLoading: false,
  product: undefined,
  products: [],
  category: undefined,
  categories: [],
  setProduct: (product: Product) => set({ product }),
  setProducts: (products: Product[]) => set({ products }),
  setCategory: (category: Category) => set({ category }),
  setCategories: (categories: Category[]) => set({ categories }),
  createProduct: async (formData, config) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post(
        "/admin/add-product",
        formData,
        config
      );

      set((state) => ({
        products: [...state.products, data.product],
      }));
      toast.success(data.message);

      return data.product;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  updateProduct: async (input) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.patch(
        "/admin/update-product-details",
        input
      );

      set((state) => ({
        product: {
          ...state.product,
          ...data.product,
        },
      }));

      set((state) => ({
        products: state.products.map((product) =>
          product._id === input.productId
            ? { ...product, ...data.product }
            : product
        ),
      }));
      toast.success(data.message);

      return data.product;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  deleteProduct: async (id) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.delete(`/products/${id}`);

      set((state) => ({
        products: state.products.filter((product) => product?._id !== id),
      }));
      toast.success(data.message);
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  updateImage: async (formData, config) => {
    try {
      set({ imageLoading: true });
      const { data } = await axiosInstance.post(
        "admin/update-product-image",
        formData,
        config
      );

      return data;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      set({ imageLoading: false });
    }
  },
  createCategory: async (input) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post(
        "/admin/create-category",
        input
      );

      set((state) => ({ categories: [...state.categories, data.category] }));

      toast.success(data.message);

      return data.category;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
}));
