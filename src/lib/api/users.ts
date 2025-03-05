import { axiosInstance } from "../axios";

export const getUsers = async () => {
  const { data } = await axiosInstance.get("/admin/users");
  return data.users;
};

export const getUserById = async (id: string) => {
  const { data } = await axiosInstance.get(`/admin/users/${id}`);
  return data.user;
};
