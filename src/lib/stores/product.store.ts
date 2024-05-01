import { Product } from "@/interfaces/product.interface";
import { create } from "zustand";

interface IProductStore {
  loading: boolean;
  product: Product | undefined;
  products: Product[];
  setProduct: (product: Product) => void;
  setProducts: (product: Product[]) => void;
}

export const useProductStore = create<IProductStore>((set) => ({
  loading: false,
  product: undefined,
  products: [],
  setProduct: (product: Product) => set({ product }),
  setProducts: (products: Product[]) => set({ products }),
}));
