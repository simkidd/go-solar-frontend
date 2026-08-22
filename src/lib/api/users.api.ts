import { axiosInstance } from "../axios";

export const getUsers = async () => {
  try {
    const { data } = await axiosInstance.get("/admin/users");
    return data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/admin/users/${id}`);
    return data.user;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
};
