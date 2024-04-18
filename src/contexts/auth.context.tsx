// "use client";
import React, { createContext, useContext, useState } from "react";
import { LoginInput, SignUpInput, User } from "@/interfaces/auth.interface";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import Cookies from "js-cookie";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";

interface IAuth {
  loading: boolean;
  currentUser: User | null;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignUpInput) => Promise<void>;
}

export const AuthContext = createContext<IAuth>({} as IAuth);

export const useAuth = () => useContext(AuthContext);

const token = Cookies.get(TOKEN_NAME);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  const login = async (input: LoginInput) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/login", input);

      const user: User = data.data.user;

      if (!user?.is_verified) {
        alert("Please verify your email to login");
        return;
      }

      const userToken = JSON.stringify(user);
      if (userToken) {
        alert(data.message);
        Cookies.set(USER_DETAILS, userToken);
        Cookies.set(TOKEN_NAME, data.data.user.token);
      }
    } catch (error) {
      const errorMsg = error as any;
      alert(errorMsg?.response.data.message);
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
        alert(data.message);
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

  return (
    <AuthContext.Provider value={{ loading, currentUser, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
