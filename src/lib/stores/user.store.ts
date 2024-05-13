import { User } from "@/interfaces/auth.interface";
import { create } from "zustand";

interface IUserStore {
  loading: boolean;
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  loading: false,
  users: [],
  setUsers: (users: User[]) => set({ users }),
}));
