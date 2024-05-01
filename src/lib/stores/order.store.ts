import { Order } from "@/interfaces/order.interface";
import { create } from "zustand";

interface IOrderStore {
  loading: boolean;
  order: Order | undefined;
  orders: Order[];
  setOrder: (order: Order) => void;
  setOrders: (order: Order[]) => void;
}

export const useOrderStore = create<IOrderStore>((set) => ({
  loading: false,
  order: undefined,
  orders: [],
  setOrder: (order: Order) => set({ order }),
  setOrders: (orders: Order[]) => set({ orders }),
}));
