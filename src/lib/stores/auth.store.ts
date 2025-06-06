import {
  ChangePasswordInput,
  EmailInput,
  LoginInput,
  SignUpInput,
  User,
} from "@/interfaces/auth.interface";
import { create } from "zustand";
import { axiosInstance } from "../axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";

interface IAuthStore {
  loading: boolean;
  user: User | undefined;
  users: User[];
  setUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  logout: () => void;
  signup: (input: SignUpInput) => Promise<void>;
  resendVerification: (input: EmailInput) => Promise<void>;
  forgotPassword: (input: EmailInput) => Promise<void>;
  resetPassword: (input: ChangePasswordInput, token: string) => Promise<void>;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  loading: false,
  isAuthenticated: false,
  user: undefined,
  users: [],
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setUser: (user: User) => set({ user }),
  setUsers: (users: User[]) => set({ users }),
  showSidebar: false,
  setShowSidebar: (showSidebar: boolean) => set({ showSidebar }),
  collapsed: false,
  setCollapsed: (collapsed: boolean) => set({ collapsed }),
  logout: () => {
    // window.location.href = "/account/login";
    Cookies.remove(TOKEN_NAME);
    Cookies.remove(USER_DETAILS);
    set({ user: undefined, isAuthenticated: false });
  },

  signup: async (input) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post("/auth/signup", input);

      if (data) {
        window.location.href = "/account/registration-success";
      }
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      set({ loading: false });
    }
  },
  resendVerification: async (input) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post(
        "/auth/request-verification",
        input
      );

      console.log(data);
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      set({ loading: false });
    }
  },
  forgotPassword: async (input) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.post("/auth/forgotpassword", input);

      toast.success(data.data);
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      set({ loading: false });
    }
  },
  resetPassword: async (input, token) => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.put(
        `/auth/resetpassword/${token}`,
        input
      );

      if (data.success === true) {
        toast.success(data.message);
        window.location.href = "/account/login";
      } else {
        return;
      }
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      set({ loading: false });
    }
  },
}));
