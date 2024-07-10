import { User } from "@/interfaces/auth.interface";
import { create } from "zustand";
import { axiosInstance } from "../axios";
import { toast } from "react-toastify";

interface IUserStore {
  loading: boolean;
  setLoading: (value: boolean) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<IUserStore>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  users: [],
  setUsers: (users: User[]) => set({ users }),

  // for refetching
  fetchUsers: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/admin/users");
      set({ users: data.users });
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response?.data?.message);
      console.log(errorMsg?.response?.data?.message);
    } finally {
      set({ loading: false });
    }
  },
}));
