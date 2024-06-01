import { Order } from "@/interfaces/order.interface";
import { create } from "zustand";

interface IOrderStore {
  loading: boolean;
  order: Order | undefined;
  orders: Order[];
  userOrder: Order | undefined;
  userOrders: Order[];
  setOrder: (order: Order) => void;
  setOrders: (orders: Order[]) => void;
  setUserOrder: (userOrder: Order) => void;
  setUserOrders: (userOrder: Order[]) => void;
}

export const useOrderStore = create<IOrderStore>((set) => ({
  loading: false,
  order: undefined,
  orders: [],
  userOrder: undefined,
  userOrders: [],
  setOrder: (order: Order) => set({ order }),
  setOrders: (orders: Order[]) => set({ orders }),
  setUserOrder: (userOrder: Order) => set({ userOrder }),
  setUserOrders: (userOrders: Order[]) => set({ userOrders }),
}));
