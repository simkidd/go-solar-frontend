import { axiosInstance } from "../axios";

export const getOrders = async () => {
  try {
    const { data } = await axiosInstance.get("/admin/all-orders");
    return data.orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/users/orders/${id}`);
    return data.order || null;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
};

export const getOrder = getOrderById;

export const getUserOrders = async () => {
  try {
    const { data } = await axiosInstance.get("/users/orders/user-orders");
    return data.orders || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};
