"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ChangePasswordInput,
  EmailInput,
  LoginInput,
  SignUpInput,
  User,
} from "@/interfaces/auth.interface";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import Cookies from "js-cookie";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface IAuth {
  loading: boolean;
  currentUser: User | null;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignUpInput) => Promise<void>;
  resendVerification: (input: EmailInput) => Promise<void>;
  forgotPassword: (input: EmailInput) => Promise<void>;
  resetPassword: (input: ChangePasswordInput, token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuth>({} as IAuth);

export const useAuth = () => useContext(AuthContext);

const userDetails = Cookies.get(USER_DETAILS) || "";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (input: LoginInput) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/login", input);

      const user: User = data.data.user;

      if (!user?.is_verified) {
        toast.success("Please verify your email to login");
        return;
      }

      const userToken = JSON.stringify(user);
      if (userToken) {
        Cookies.set(USER_DETAILS, userToken);
        Cookies.set(TOKEN_NAME, data.data.user.token);
        toast.success(data.message);
      }

      setTimeout(() => {
        if (user?.isAdmin || user?.isSuperAdmin) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 300);
    } catch (error) {
      const errorMsg = error as any;
      toast.error(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (input: SignUpInput) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/signup", input);

      if (data) {
        toast.success(data.message);
        // setTimeout(() => {
        //   router.push("/account/verify");
        // }, 300);
      }
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (input: EmailInput) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/auth/request-verification",
        input
      );

      console.log(data);
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (input: EmailInput) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/forgotpassword", input);

      if (data) {
        alert(data.data);
      }
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (input: ChangePasswordInput, token: string) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.put(
        `/auth/resetpassword/${token}`,
        input
      );

      if (data) {
        alert(data.message);
      }
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
      console.log(errorMsg?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    window.location.href = "/account/login";
    setCurrentUser(null);
    Cookies.remove(TOKEN_NAME);
    Cookies.remove(USER_DETAILS);
  };

  useEffect(() => {
    if (userDetails) {
      const authUser = JSON.parse(userDetails);
      setCurrentUser(authUser);
    }
  }, [userDetails]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        currentUser,
        login,
        signup,
        resendVerification,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
