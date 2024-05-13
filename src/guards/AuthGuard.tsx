"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import LoadingSpinner from "@/components/LoadingSpinner";

const TOKEN = Cookies.get(TOKEN_NAME) || "";
const userToken = Cookies.get(USER_DETAILS) || "";

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (userToken) {
      const decodedToken = JSON.parse(userToken);
      setUser(decodedToken);
    }
  }, [userToken]);

  return <>{children}</>;
};

export default AuthGuard;
