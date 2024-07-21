import { Product } from "@/interfaces/product.interface";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IHistoryStore {
  viewHistory: Product[];
  addProductToHistory: (data: Product) => void;
}

export const useViewHistoryStore = create(
  persist<IHistoryStore>(
    (set, get) => ({
      viewHistory: [],
      addProductToHistory: (data: Product) => {
        const viewHistory = get().viewHistory; 
        const isExisting = viewHistory.find(
          (product) => product._id === data._id
        );

        if (!isExisting) {
          const newHistory = [...viewHistory, data];
          set({ viewHistory: newHistory });
        }
      },
    }),
    {
      name: "_goSolar-viewHistory",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
