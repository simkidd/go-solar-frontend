import { User } from "@/interfaces/auth.interface";
import { create } from "zustand";
import Cookies from "js-cookie";
import { REFRESH_TOKEN_NAME, TOKEN_NAME, USER_DETAILS } from "@/utils/constants";

interface IAuthStore {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: undefined,
  isAuthenticated: false,
  showSidebar: false,
  collapsed: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setUser: (user: User | undefined) => set({ user }),
  setShowSidebar: (showSidebar: boolean) => set({ showSidebar }),
  setCollapsed: (collapsed: boolean) => set({ collapsed }),
  logout: () => {
    Cookies.remove(TOKEN_NAME);
    Cookies.remove(REFRESH_TOKEN_NAME);
    Cookies.remove(USER_DETAILS);
    set({ user: undefined, isAuthenticated: false });
  },
}));
