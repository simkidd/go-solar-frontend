import { Order, UpdateTrackingStatus } from "@/interfaces/order.interface";
import { create } from "zustand";
import { axiosInstance } from "../axios";
import { toast } from "react-toastify";

interface IOrderStore {
  loading: boolean;
  setLoading: (value: boolean) => void;
  statusLoading: boolean;
  setStatusLoading: (value: boolean) => void;
  order: Order | undefined;
  orders: Order[];
  userOrder: Order | undefined;
  userOrders: Order[];
  setOrder: (order: Order) => void;
  setOrders: (orders: Order[]) => void;
  setUserOrder: (userOrder: Order) => void;
  setUserOrders: (userOrder: Order[]) => void;
  fetchOrders: () => Promise<void>;
  updateTrackingLevel: (input: UpdateTrackingStatus) => Promise<void>;
}

export const useOrderStore = create<IOrderStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  statusLoading: false,
  setStatusLoading: (statusLoading: boolean) => set({ statusLoading }),
  order: undefined,
  orders: [],
  userOrder: undefined,
  userOrders: [],
  setOrder: (order: Order) => set({ order }),
  setOrders: (orders: Order[]) => set({ orders }),
  setUserOrder: (userOrder: Order) => set({ userOrder }),
  setUserOrders: (userOrders: Order[]) => set({ userOrders }),

  updateTrackingLevel: async (input: UpdateTrackingStatus) => {
    try {
      set({ statusLoading: true });
      const { data } = await axiosInstance.post(
        "/users/orders/update-tracking-level",
        input
      );

      set((state) => ({
        orders: [...state.orders, data.order],
      }));

      toast.success(data.message);
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data?.message);
      console.log(errorMsg?.response?.data?.message);
    } finally {
      set({ statusLoading: false });
    }
  },

  // for refetching
  fetchOrders: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/admin/all-orders");
      set({ orders: data.orders });
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data?.message);
      console.log(errorMsg?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
}));
