import { User } from "@/interfaces/auth.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const USER_KEYS = {
  all: ["users"] as const,
  customers: () => [...USER_KEYS.all, "customers"] as const,
  admins: () => [...USER_KEYS.all, "admins"] as const,
  detail: (id: string) => [...USER_KEYS.all, "detail", id] as const,
};

// Fetch all registered customers
export const useAllUsersQuery = () => {
  return useQuery<User[]>({
    queryKey: USER_KEYS.customers(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/users");
      return data?.users || [];
    },
  });
};

// Fetch all administrators and staff
export const useAdminUsersQuery = () => {
  return useQuery<User[]>({
    queryKey: USER_KEYS.admins(),
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/admins");
      return data?.admins || [];
    },
  });
};
