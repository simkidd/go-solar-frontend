import {
  Category,
  CreateCategoryInput,
  Product,
  UpdateCategoryInput,
  UpdateProductInput,
  Offer,
  CreateOfferInput,
  UpdateOfferInput,
  AddOfferProductDTO,
} from "@/interfaces/product.interface";
import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../axios";
import { revalidatePath } from "next/cache";

interface IProductStore {
  loading: boolean;
  setLoading: (value: boolean) => void;
  imageLoading: boolean;
  product: Product | undefined;
  products: Product[];
  setProduct: (product: Product) => void;
  setProducts: (products: Product[]) => void;
  createProduct: (formData: FormData, config: any) => Promise<void>;
  updateProduct: (input: UpdateProductInput) => Promise<void>;
  deleteProduct: (id: string) => void;
  updateImages: (formData: FormData, config: any) => Promise<void>;
  category: Category | undefined;
  categories: Category[];
  setCategory: (category: Category) => void;
  setCategories: (categories: Category[]) => void;
  createCategory: (input: CreateCategoryInput) => Promise<void>;
  updateCategory: (input: UpdateCategoryInput) => Promise<void>;
  deleteCategory: (id: string) => void;
  offer: Offer | undefined;
  offers: Offer[];
  setOffer: (order: Offer) => void;
  setOffers: (orders: Offer[]) => void;
  createOffer: (input: CreateOfferInput) => Promise<void>;
  updateOffer: (input: UpdateOfferInput, id: string) => Promise<void>;
  deleteOffer: (id: string) => void;
  addToOffer: (input: AddOfferProductDTO) => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchOffers: () => Promise<void>;
}

export const useProductStore = create<IProductStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  imageLoading: false,
  product: undefined,
  products: [],
  category: undefined,
  categories: [],
  offer: undefined,
  offers: [],
  setProduct: (product: Product) => set({ product }),
  setProducts: (products: Product[]) => set({ products }),
  setCategory: (category: Category) => set({ category }),
  setCategories: (categories: Category[]) => set({ categories }),
  setOffer: (offer: Offer) => set({ offer }),
  setOffers: (offers: Offer[]) => set({ offers }),

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

      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
      return data.product;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
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

      const res = data.product as Product;

      set((state) => ({
        product: {
          ...state.product,
          ...res,
        },
      }));

      set((state) => ({
        products: state.products.map((product) =>
          product._id === input.productId ? { ...product, ...res } : product
        ),
      }));
      toast.success(data.message);

      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
      return data.product;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(errorMsg?.response?.data.message);
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
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(errorMsg?.response?.data.message);
    } finally {
      set({ loading: false });
    }
  },
  updateImages: async (formData, config) => {
    try {
      set({ imageLoading: true });
      const { data } = await axiosInstance.patch(
        "/admin/update-product-image",
        formData,
        config
      );

      const res = data.product as Product;

      set((state) => ({
        product: {
          ...state.product,
          ...res,
        },
      }));

      toast.success(data.message);

      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
      return data;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(errorMsg?.response?.data.message);
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

      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
      return data.category;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(errorMsg?.response?.data.message);
    } finally {
      set({ loading: false });
    }
  },
  updateCategory: async (input) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.patch(
        "/admin/update-category",
        input
      );

      set((state) => ({
        category: {
          ...state.category,
          ...data.category,
        },
      }));

      set((state) => ({
        categories: state.categories.map((category) =>
          category._id === input.categoryId
            ? { ...category, ...data.category }
            : category
        ),
      }));

      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
      toast.success(data.message);
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(errorMsg?.response?.data.message);
    } finally {
      set({ loading: false });
    }
  },
  deleteCategory: async (id) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.delete(`/category/${id}`);

      set((state) => ({
        categories: state.categories.filter((category) => category?._id !== id),
      }));
      toast.success(data.message);
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(errorMsg?.response?.data.message);
    } finally {
      set({ loading: false });
    }
  },
  createOffer: async (input) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post("/offers/create-offer", input);

      set((state) => ({
        offers: [...state.offers, data.offer],
      }));
      toast.success(data.message);

      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
      return data.offer;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      set({ loading: false });
    }
  },
  updateOffer: async (input: UpdateOfferInput, id: string) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.put(
        `/offers/update-offer/${id}`,
        input
      );
      const res = data.offer as Offer;

      set((state) => ({
        offer: {
          ...state.offer,
          ...res,
        },
      }));
      set((state) => ({
        offers: state.offers.map((offer) =>
          offer._id === id ? { ...offer, ...res } : offer
        ),
      }));
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
      toast.success(data.message);
      return data.offer;
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      set({ loading: false });
    }
  },
  deleteOffer: async (id) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.delete(`/offers/delete-offer/${id}`);

      set((state) => ({
        offers: state.offers.filter((offer) => offer?._id !== id),
      }));
      toast.success(data.message);
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/product");
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data.message);
      console.log(errorMsg?.response?.data.message);
    } finally {
      set({ loading: false });
    }
  },
  addToOffer: async (input) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.patch(
        "/admin/add-offer-to-products",
        input
      );

      console.log("add to offer", data);
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      set({ loading: false });
    }
  },

  // for refetching
  fetchProducts: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/products");
      set({ products: data.products });
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data?.message);
      console.log(errorMsg?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  fetchCategories: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/categories");
      set({ categories: data.categories });
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data?.message);
      console.log(errorMsg?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
  fetchOffers: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/offers");
      set({ offers: data.offers });
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data?.message);
      console.log(errorMsg?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
}));
