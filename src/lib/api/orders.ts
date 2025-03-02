import { axiosInstance } from "../axios";

export const getOrders = async () => {
  const { data } = await axiosInstance.get("/admin/all-orders");
  return data.orders;
};

export const getOrderById = async (id: string) => {
  const { data } = await axiosInstance.get(`/users/orders/${id}`);
  return data.order;
};

export const getUserOrders = async () => {
  const { data } = await axiosInstance.get("/users/orders/user-orders");
  return data.orders;
};
