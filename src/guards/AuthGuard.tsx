"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import LoadingSpinner from "@/components/LoadingSpinner";
import { axiosInstance } from "@/lib/axios";
import { useProductStore } from "@/lib/stores/product.store";
import { useOrderStore } from "@/lib/stores/order.store";

const TOKEN = Cookies.get(TOKEN_NAME) || "";
const userToken = Cookies.get(USER_DETAILS) || "";

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, setUser } = useAuthStore();
  const { setProducts, setCategories, setLoading } = useProductStore();
  const { setOrders } = useOrderStore();

  useEffect(() => {
    if (userToken) {
      const decodedToken = JSON.parse(userToken);
      setUser(decodedToken);
    }
  }, [userToken]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/products");
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const getCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/categories");
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    };

    const getOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/all-orders");

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      }
    };

    Promise.all([getProducts(), getCategories(), getOrders()]);
  }, []);

  // if (!user) {
  //   return <LoadingSpinner />;
  // }

  return <>{children}</>;
};

export default AuthGuard;
