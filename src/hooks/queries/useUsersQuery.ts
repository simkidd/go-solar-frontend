import { User } from "@/interfaces/auth.interface";
import { axiosInstance } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const USER_KEYS = {
  all: ["users"] as const,
  me: ["users", "me"] as const,
  customers: () => [...USER_KEYS.all, "customers"] as const,
  admins: () => [...USER_KEYS.all, "admins"] as const,
  detail: (id: string) => [...USER_KEYS.all, "detail", id] as const,
};

// Fetch the currently authenticated user from the server
export const useCurrentUserQuery = (enabled = true) => {
  return useQuery<User>({
    queryKey: USER_KEYS.me,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/auth/me");
      return data?.user;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};


export interface PaginatedUsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Fetch registered customers with pagination and search
export const useAllUsersQuery = (params?: { page?: number; limit?: number; q?: string }) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const q = params?.q ?? "";

  return useQuery<PaginatedUsersResponse>({
    queryKey: [...USER_KEYS.customers(), page, limit, q],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/users", {
        params: { page, limit, q },
      });
      return {
        users: data?.users || [],
        pagination: data?.pagination || { total: 0, page, limit, pages: 1 },
      };
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

// Mutation for creating manual customers or administrator accounts
export const useCreateAccountMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post("/admin/create-account", payload);
      return data?.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};

// Mutation for updating administrative permissions/roles
export const useUpdateUserRoleMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userid, payload }: { userid: string; payload: { isAdmin?: boolean; isSuperAdmin?: boolean } }) => {
      const { data } = await axiosInstance.patch(`/admin/users/${userid}/role`, payload);
      return data?.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};
