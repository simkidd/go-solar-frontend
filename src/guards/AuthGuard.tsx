"use client";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useBlogStore } from "@/lib/stores/blog.store";
import { useOrderStore } from "@/lib/stores/order.store";
import { useProductStore } from "@/lib/stores/product.store";
import { useUserStore } from "@/lib/stores/user.store";
import { TOKEN_NAME, USER_DETAILS } from "@/utils/constants";
import Cookies from "js-cookie";
import React, { useEffect } from "react";

const TOKEN = Cookies.get(TOKEN_NAME) || "";
const userToken = Cookies.get(USER_DETAILS) || "";

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, setUser } = useAuthStore();
  const { setProducts, setCategories, setLoading, setOffers } =
    useProductStore();
  const {
    setOrders,
    setUserOrders,
    setLoading: setOrderLoading,
  } = useOrderStore();
  const { setPosts, setLoading: setPostLoading } = useBlogStore();
  const { setUsers, setLoading: setUserLoading } = useUserStore();

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
        setOrderLoading(true);
        const { data } = await axiosInstance.get("/admin/all-orders");

        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setOrderLoading(false);
      }
    };
    const getUserOrders = async () => {
      try {
        setOrderLoading(true);
        const { data } = await axiosInstance.get("/users/orders/user-orders");

        setUserOrders(data.orders);
      } catch (error) {
        console.log(error);
      } finally {
        setOrderLoading(false);
      }
    };

    const getPosts = async () => {
      try {
        setPostLoading(true);
        const { data } = await axiosInstance.get("/blogs");

        setPosts(data.blogs);
      } catch (error) {
        console.log(error);
      } finally {
        setPostLoading(false);
      }
    };

    const getOffers = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/offers");

        setOffers(data.offers);
      } catch (error) {
        setLoading(false);
      }
    };

    const getUsers = async () => {
      try {
        setUserLoading(true);
        const { data } = await axiosInstance.get("/admin/users");
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      } finally {
        setUserLoading(false);
      }
    };

    Promise.all([
      getProducts(),
      getCategories(),
      getOrders(),
      getPosts(),
      getUserOrders(),
      getOffers(),
      getUsers(),
    ]);
  }, []);

  // if (!user) {
  //   return <LoadingSpinner />;
  // }

  return <>{children}</>;
};

export default AuthGuard;
